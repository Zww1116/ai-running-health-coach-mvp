import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  buildAiHandoff,
  compileExcludePolicy,
  isHardBlockedPath,
} from './build-ai-handoff.mjs';

const requiredFiles = [
  'PROJECT.md',
  'project/README.md',
  'project/INDEX.md',
  'project/CurrentStatus.md',
  'project/Roadmap.md',
  'project/Backlog.md',
  'project/SourceOfTruth.md',
  'project/DefinitionOfDone.md',
  'project/FileManagementRules.md',
  'project/VersioningPolicy.md',
  'project/DecisionCaptureWorkflow.md',
  'project/templates/Sprint-TEMPLATE.md',
  'project/templates/ADR-TEMPLATE.md',
  'project/templates/Confirmed-Decision-Prompt.md',
  'project/sprints/Sprint-001-Foundation-Privacy-Portability.md',
  'project/sprints/Sprint-002-Brand-Foundation.md',
  'project/decisions/README.md',
  'project/decisions/ADR-0001-Single-Repository.md',
  'project/decisions/ADR-0002-Private-Data-Separation.md',
  'project/decisions/ADR-0003-Replaceable-AI-Providers.md',
  'project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md',
  'project/archive/README.md',
  'brand/README.md',
  'brand/00_BrandDNA.md',
  'brand/01_BrandPositioning.md',
  'brand/02_MissionVision.md',
  'brand/03_BrandValues.md',
  'brand/04_BrandPersonality.md',
  'brand/05_BrandVoice.md',
  'brand/06_ProductPrinciples.md',
  'brand/07_BrandArchitecture.md',
  'brand/08_NamingBrief.md',
  'brand/09_BrandGuardrails.md',
  'brand/10_FounderReviewChecklist.md',
  'brand/CHANGELOG.md',
  'product/README.md',
  'architecture/README.md',
  'architecture/SystemArchitecture.md',
  'architecture/DataOwnershipAndBoundaries.md',
  'architecture/DataFlow.md',
  'architecture/AIProviderPortability.md',
  'architecture/BackupAndRecovery.md',
  'security/README.md',
  'security/PrivacyModel.md',
  'security/DataClassification.md',
  'security/SecretsPolicy.md',
  'security/AIDataSharingPolicy.md',
  'security/LocalPrivateFiles.md',
  'security/IncidentResponse.md',
  'security/PrivacyAudit-Initial.md',
  'security/PrivacyAudit-Review.md',
  'knowledge/README.md',
  'agents/README.md',
  'prompts/README.md',
  'prompts/core/README.md',
  'prompts/platforms/chatgpt/README.md',
  'prompts/platforms/claude/README.md',
  'prompts/platforms/gemini/README.md',
  'prompts/platforms/local/README.md',
  'schemas/README.md',
  'schemas/daily-health-data.schema.json',
  'schemas/analysis-packet.schema.json',
  'schemas/ai-analysis-result.schema.json',
  'schemas/portable-backup-manifest.schema.json',
  'api/README.md',
  'migration/README.md',
  'migration/AI_HANDOFF.md',
  'migration/manifest.json',
  'migration/NEW_AI_BOOTSTRAP_PROMPT.md',
  'migration/MIGRATION_CHECKLIST.md',
  'migration/RESTORE_TEST.md',
  'migration/PRIVATE_CONTEXT_TEMPLATE.md',
  'migration/EXCLUDED_DATA.md',
  'scripts/build-ai-handoff.mjs',
  'scripts/privacy-audit.mjs',
  'scripts/validate-foundation.mjs',
];
const requiredGitignoreRules = [
  '.env',
  '.env.*',
  '!.env.example',
  'exports/',
  'backups/',
  'private-data/',
  'private-profile/',
  '*.health-backup.zip',
  '*.health-backup.json',
  '*.private-context.md',
  '*.sqlite',
  '*.sqlite3',
  '*.db',
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx',
];
const requiredSchemaFields = ['$schema', '$id', 'title', 'type'];
const sensitivePathSamples = [
  '.env',
  '.env.production',
  'private-data/record.json',
  'private-profile/profile.md',
  'backups/archive.health-backup.zip',
  'database.sqlite',
  'database.sqlite3',
  'database.db',
  'certificate.pem',
  'private.key',
  'certificate.p12',
  'certificate.pfx',
];

export function runFoundationValidation({ rootDir = process.cwd() } = {}) {
  const resolvedRoot = path.resolve(rootDir);
  const errors = [];
  const warnings = [];

  validateRequiredFiles(resolvedRoot, requiredFiles, errors);

  const trackedFiles = listTrackedFiles(resolvedRoot, warnings);
  const validationFiles = listValidationFiles(resolvedRoot, trackedFiles);
  const markdownFiles = validationFiles.filter((file) => file.endsWith('.md'));
  const jsonFiles = validationFiles.filter((file) => file.endsWith('.json'));

  validateMarkdownFrontMatter(resolvedRoot, requiredFiles, errors);
  mergeResults(
    { errors, warnings },
    validateMarkdownLinks(resolvedRoot, markdownFiles),
  );
  mergeResults(
    { errors, warnings },
    validateJsonDocuments(resolvedRoot, jsonFiles),
  );

  const manifestPath = path.join(resolvedRoot, 'migration', 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    errors.push(`Cannot validate manifest: ${error.message}`);
  }

  if (manifest) {
    validateManifest(resolvedRoot, manifest, errors, warnings);
    mergeResults(
      { errors, warnings },
      validateManifestExclusionFixture(manifest),
    );
    validateGeneratedPack(resolvedRoot, manifest, errors, warnings);
  }

  validateGitignore(resolvedRoot, errors);

  return { errors, warnings };
}

export function validateMarkdownLinks(rootDir, markdownFiles) {
  const errors = [];
  const warnings = [];

  for (const relativePath of markdownFiles) {
    const absolutePath = resolveWithinRoot(rootDir, relativePath);
    if (!absolutePath || !fs.existsSync(absolutePath)) continue;
    const source = fs.readFileSync(absolutePath, 'utf8');
    const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;
    const referencePattern = /^\s{0,3}\[[^\]]+]:\s*(\S.*)$/gm;
    const destinations = [
      ...[...source.matchAll(linkPattern)].map((match) => match[1]),
      ...[...source.matchAll(referencePattern)].map((match) => match[1]),
    ];

    for (const rawDestination of destinations) {
      const destination = parseMarkdownDestination(rawDestination);
      if (!destination || shouldIgnoreMarkdownDestination(destination)) continue;

      const pathOnly = destination.split('#')[0].split('?')[0];
      if (!pathOnly) continue;

      let decodedPath;
      try {
        decodedPath = decodeURIComponent(pathOnly);
      } catch {
        warnings.push(
          `Could not decode Markdown link in ${relativePath}: ${pathOnly}`,
        );
        continue;
      }

      const targetPath = path.resolve(
        path.dirname(absolutePath),
        ...decodedPath.replaceAll('\\', '/').split('/'),
      );
      const targetRelative = path.relative(rootDir, targetPath);
      if (targetRelative.startsWith('..') || path.isAbsolute(targetRelative)) {
        errors.push(
          `Local Markdown link escapes project root in ${relativePath}: ${destination}`,
        );
      } else if (!fs.existsSync(targetPath)) {
        errors.push(
          `Broken local Markdown link in ${relativePath}: ${destination}`,
        );
      }
    }
  }

  return { errors, warnings };
}

export function listValidationFiles(rootDir, trackedFiles = []) {
  const files = new Set(trackedFiles.map((file) => toPosix(file)));
  const blockedDirectories = new Set([
    '.git',
    'node_modules',
    'dist',
    'exports',
    'backups',
    'private-data',
    'private-profile',
  ]);

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && blockedDirectories.has(entry.name.toLowerCase())) {
        continue;
      }
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (entry.isFile()) {
        const relativePath = toPosix(path.relative(rootDir, absolutePath));
        if (relativePath.endsWith('.md') || relativePath.endsWith('.json')) {
          files.add(relativePath);
        }
      }
    }
  }

  visit(rootDir);
  return [...files].sort();
}

export function validateJsonDocuments(rootDir, jsonFiles) {
  const errors = [];
  const warnings = [];

  for (const relativePath of jsonFiles) {
    const absolutePath = resolveWithinRoot(rootDir, relativePath);
    if (!absolutePath || !fs.existsSync(absolutePath)) continue;

    let document;
    try {
      document = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    } catch (error) {
      errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
      continue;
    }

    if (relativePath.startsWith('schemas/') && relativePath.endsWith('.schema.json')) {
      for (const field of requiredSchemaFields) {
        if (
          !Object.hasOwn(document, field) ||
          typeof document[field] !== 'string' ||
          document[field].trim() === ''
        ) {
          errors.push(`JSON Schema ${relativePath} is missing ${field}.`);
        }
      }
    }
  }

  return { errors, warnings };
}

export function validateManifestExclusionFixture(manifest) {
  const errors = [];
  const warnings = [];
  const temporaryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'manifest-exclude-validation-'),
  );
  const projectRoot = path.join(temporaryRoot, 'project');
  const exportDir = path.join(temporaryRoot, 'export');
  const fixtureManifest = {
    ...manifest,
    include: ['.'],
    mergeOrder: ['safe.md'],
    requiredFiles: ['safe.md'],
  };
  const sensitiveFixtures = [
    '.env',
    '.env.production',
    'private-data/record.md',
    'private-profile/profile.md',
    'backups/archive.md',
    'records.sqlite',
    'records.db',
    'certificate.pem',
    'private.key',
    'records.health-backup.json',
  ];

  try {
    writeFixtureFile(projectRoot, 'safe.md', '# Safe\n');
    for (const relativePath of sensitiveFixtures) {
      writeFixtureFile(projectRoot, relativePath, 'synthetic fixture only\n');
    }
    writeFixtureFile(
      projectRoot,
      'migration/manifest.json',
      `${JSON.stringify(fixtureManifest, null, 2)}\n`,
    );

    const result = buildAiHandoff({
      rootDir: projectRoot,
      manifestPath: path.join(projectRoot, 'migration', 'manifest.json'),
      exportDir,
    });
    warnings.push(...result.warnings);

    const packedFiles = [...walkFiles(path.join(exportDir, 'AI-Core-Pack'))].map(
      (file) =>
        toPosix(path.relative(path.join(exportDir, 'AI-Core-Pack'), file)),
    );
    if (!packedFiles.includes('safe.md')) {
      errors.push('Manifest exclusion fixture did not export its safe control file.');
    }
    for (const relativePath of sensitiveFixtures) {
      if (packedFiles.includes(relativePath)) {
        errors.push(
          `manifest.exclude allowed synthetic sensitive file: ${relativePath}`,
        );
      }
    }
  } catch (error) {
    errors.push(`Manifest exclusion fixture failed: ${error.message}`);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }

  return { errors, warnings };
}

function validateRequiredFiles(rootDir, files, errors) {
  for (const relativePath of files) {
    if (!fs.existsSync(path.join(rootDir, ...relativePath.split('/')))) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }
}

function validateMarkdownFrontMatter(rootDir, files, errors) {
  for (const relativePath of files.filter((file) => file.endsWith('.md'))) {
    const filePath = path.join(rootDir, ...relativePath.split('/'));
    if (!fs.existsSync(filePath)) continue;
    const source = fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n');
    if (!source.startsWith('---\n')) {
      errors.push(`Missing front matter: ${relativePath}`);
    }
    if (source.trim().split('\n').length <= 4) {
      errors.push(`Markdown file appears empty: ${relativePath}`);
    }
  }
}

function validateManifest(rootDir, manifest, errors, warnings) {
  for (const relativePath of manifest.requiredFiles ?? []) {
    const absolutePath = resolveWithinRoot(rootDir, relativePath);
    if (!absolutePath) {
      errors.push(`Manifest required path escapes project root: ${relativePath}`);
    } else if (!fs.existsSync(absolutePath)) {
      errors.push(`Manifest required file is missing: ${relativePath}`);
    }
  }

  for (const relativePath of manifest.include ?? []) {
    const absolutePath = resolveWithinRoot(rootDir, relativePath);
    if (!absolutePath) {
      errors.push(`Manifest include path escapes project root: ${relativePath}`);
    } else if (!fs.existsSync(absolutePath)) {
      errors.push(`Manifest include path is missing: ${relativePath}`);
    }
  }

  let excludePolicy;
  try {
    const excludeWarnings = [];
    excludePolicy = compileExcludePolicy(manifest.exclude ?? [], excludeWarnings);
    warnings.push(...excludeWarnings);
  } catch (error) {
    errors.push(error.message);
    return;
  }

  for (const sample of sensitivePathSamples) {
    if (!excludePolicy.matches(sample) && !isHardBlockedPath(sample)) {
      errors.push(`Sensitive path is not blocked by export policy: ${sample}`);
    }
  }

  const manifestSpecificSamples = [
    '.env',
    '.env.production',
    'private-data/test.json',
    'test.sqlite',
    'test.pem',
  ];
  for (const sample of manifestSpecificSamples) {
    if (!excludePolicy.matches(sample)) {
      errors.push(`manifest.exclude does not block test path: ${sample}`);
    }
  }
}

function validateGeneratedPack(rootDir, manifest, errors, warnings) {
  const temporaryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'foundation-export-validation-'),
  );
  const exportDir = path.join(temporaryRoot, 'exports');

  try {
    const result = buildAiHandoff({
      rootDir,
      manifestPath: path.join(rootDir, 'migration', 'manifest.json'),
      exportDir,
    });
    warnings.push(...result.warnings);

    const allFiles = [...walkFiles(exportDir)].map((file) =>
      toPosix(path.relative(exportDir, file)),
    );
    const corePackFiles = allFiles.filter((file) =>
      file.startsWith('AI-Core-Pack/'),
    );
    const excludePolicy = compileExcludePolicy(manifest.exclude ?? [], []);

    for (const relativePath of corePackFiles) {
      const packRelative = relativePath.slice('AI-Core-Pack/'.length);
      if (
        isHardBlockedPath(packRelative) ||
        excludePolicy.matches(packRelative)
      ) {
        errors.push(`Excluded path found in AI-Core-Pack: ${packRelative}`);
      }
    }

    validateFileIndex(exportDir, allFiles, errors);
    validateChecksums(exportDir, allFiles, errors);
    validateVersion(rootDir, exportDir, manifest, errors, warnings);
  } catch (error) {
    errors.push(`Generated pack validation failed: ${error.message}`);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function validateFileIndex(exportDir, allFiles, errors) {
  const indexPath = path.join(exportDir, 'FILE_INDEX.md');
  if (!fs.existsSync(indexPath)) {
    errors.push('Generated pack is missing FILE_INDEX.md.');
    return;
  }

  const indexedFiles = fs
    .readFileSync(indexPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));

  for (const relativePath of allFiles) {
    if (!indexedFiles.includes(relativePath)) {
      errors.push(`FILE_INDEX.md is missing: ${relativePath}`);
    }
  }
  for (const relativePath of indexedFiles) {
    if (!allFiles.includes(relativePath)) {
      errors.push(`FILE_INDEX.md references a missing file: ${relativePath}`);
    }
  }
}

function validateChecksums(exportDir, allFiles, errors) {
  const checksumPath = path.join(exportDir, 'CHECKSUMS.txt');
  if (!fs.existsSync(checksumPath)) {
    errors.push('Generated pack is missing CHECKSUMS.txt.');
    return;
  }

  const checksumEntries = new Map();
  const lines = fs
    .readFileSync(checksumPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!match) {
      errors.push(`Invalid CHECKSUMS.txt line: ${line}`);
      continue;
    }
    if (checksumEntries.has(match[2])) {
      errors.push(`CHECKSUMS.txt contains duplicate path: ${match[2]}`);
    }
    checksumEntries.set(match[2], match[1]);
  }

  if (checksumEntries.has('CHECKSUMS.txt')) {
    errors.push('CHECKSUMS.txt must not contain a checksum for itself.');
  }
  for (const relativePath of checksumEntries.keys()) {
    if (!allFiles.includes(relativePath)) {
      errors.push(`CHECKSUMS.txt references a missing file: ${relativePath}`);
    }
  }

  for (const relativePath of allFiles.filter((file) => file !== 'CHECKSUMS.txt')) {
    const expectedHash = checksumEntries.get(relativePath);
    if (!expectedHash) {
      errors.push(`CHECKSUMS.txt is missing: ${relativePath}`);
      continue;
    }
    const actualHash = crypto
      .createHash('sha256')
      .update(
        fs.readFileSync(path.join(exportDir, ...relativePath.split('/'))),
      )
      .digest('hex');
    if (actualHash !== expectedHash) {
      errors.push(`Checksum mismatch: ${relativePath}`);
    }
  }
}

function validateVersion(rootDir, exportDir, manifest, errors, warnings) {
  const versionPath = path.join(exportDir, 'VERSION.json');
  if (!fs.existsSync(versionPath)) {
    errors.push('Generated pack is missing VERSION.json.');
    return;
  }

  let version;
  try {
    version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  } catch (error) {
    errors.push(`Invalid VERSION.json: ${error.message}`);
    return;
  }

  const expectedValues = {
    currentBranch: gitOutput(rootDir, ['branch', '--show-current']),
    currentCommit: gitOutput(rootDir, ['rev-parse', 'HEAD']),
    packVersion: manifest.packVersion,
    projectVersion: manifest.projectVersion,
    schemaVersion: manifest.schemaVersion,
    promptVersion: manifest.promptVersion,
    agentVersion: manifest.agentVersion,
  };
  for (const [field, expectedValue] of Object.entries(expectedValues)) {
    if (!expectedValue || expectedValue === 'unknown') {
      warnings.push(
        `Could not reliably verify VERSION.json ${field} against Git or manifest metadata.`,
      );
      continue;
    }
    if (!version[field] || version[field] === 'unknown') {
      errors.push(`VERSION.json is missing usable ${field}.`);
    } else if (version[field] !== expectedValue) {
      errors.push(
        `VERSION.json ${field} does not match current project metadata.`,
      );
    }
  }
}

function validateGitignore(rootDir, errors) {
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    errors.push('Missing .gitignore.');
    return;
  }
  const rules = fs.readFileSync(gitignorePath, 'utf8').split(/\r?\n/);
  for (const rule of requiredGitignoreRules) {
    if (!rules.includes(rule)) {
      errors.push(`Missing .gitignore rule: ${rule}`);
    }
  }
  if (rules.includes('migration/PRIVATE_CONTEXT_TEMPLATE.md')) {
    errors.push('migration/PRIVATE_CONTEXT_TEMPLATE.md must not be ignored.');
  }
}

function listTrackedFiles(rootDir, warnings) {
  try {
    const output = execFileSync('git', ['ls-files', '-z'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return output
      .split('\0')
      .filter(Boolean)
      .map((file) => toPosix(file))
      .sort();
  } catch {
    warnings.push(
      'Unable to list Git tracked files; link and JSON validation used required files only.',
    );
    return requiredFiles;
  }
}

function parseMarkdownDestination(rawDestination) {
  const value = rawDestination.trim();
  if (value.startsWith('<')) {
    const closingBracket = value.indexOf('>');
    return closingBracket === -1 ? value.slice(1) : value.slice(1, closingBracket);
  }
  return value.split(/\s+/)[0];
}

function shouldIgnoreMarkdownDestination(destination) {
  return (
    destination.startsWith('#') ||
    destination.startsWith('/') ||
    destination.startsWith('//') ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(destination)
  );
}

function resolveWithinRoot(rootDir, relativePath) {
  const resolved = path.resolve(rootDir, ...toPosix(relativePath).split('/'));
  const relative = path.relative(rootDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolved;
}

function* walkFiles(startPath) {
  const stats = fs.statSync(startPath);
  if (stats.isFile()) {
    yield startPath;
    return;
  }
  const entries = fs
    .readdirSync(startPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const fullPath = path.join(startPath, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function gitOutput(rootDir, args) {
  try {
    return execFileSync('git', args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

function mergeResults(target, source) {
  target.errors.push(...source.errors);
  target.warnings.push(...source.warnings);
}

function writeFixtureFile(rootDir, relativePath, contents) {
  const filePath = path.join(rootDir, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

function toPosix(value) {
  return String(value).replaceAll('\\', '/');
}

function printValidationResult(result) {
  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }
  if (result.errors.length > 0) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log(
    `Foundation validation passed with ${result.warnings.length} warning(s)`,
  );
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  printValidationResult(runFoundationValidation());
}
