import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const textExtensions = new Set([
  '.md',
  '.json',
  '.js',
  '.jsx',
  '.mjs',
  '.css',
  '.html',
  '.sql',
  '.yml',
  '.yaml',
  '.txt',
]);
const hardBlockedDirNames = new Set([
  'node_modules',
  'dist',
  'exports',
  'backups',
  'private-data',
  'private-profile',
  '.git',
]);
const hardBlockedExtensions = new Set([
  '.sqlite',
  '.sqlite3',
  '.db',
  '.pem',
  '.key',
  '.p12',
  '.pfx',
]);
const hardBlockedSuffixes = [
  '.health-backup.zip',
  '.health-backup.json',
  '.private-context.md',
];
const contentRiskHintNames = new Set(['API Key', 'Secret', 'Token']);

export function buildAiHandoff(options = {}) {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const manifestPath = path.resolve(
    options.manifestPath ?? path.join(rootDir, 'migration', 'manifest.json'),
  );
  const exportDir = path.resolve(options.exportDir ?? path.join(rootDir, 'exports'));
  const corePackDir = path.join(exportDir, 'AI-Core-Pack');
  const warnings = [];

  if (exportDir === rootDir) {
    throw new Error('Export directory must not be the project root.');
  }

  const manifest = readJson(manifestPath);
  const excludePolicy = compileExcludePolicy(manifest.exclude ?? [], warnings);

  validateRequiredFiles(rootDir, manifest.requiredFiles ?? []);
  const includedFiles = collectFilesFromEntries(
    rootDir,
    manifest.include ?? [],
    excludePolicy,
    warnings,
    true,
  );
  const mergedFiles = collectFilesFromEntries(
    rootDir,
    manifest.mergeOrder ?? [],
    excludePolicy,
    warnings,
    false,
  );
  scanForBlockingSecrets(
    rootDir,
    [...new Set([...includedFiles, ...mergedFiles])],
    excludePolicy.contentRiskHints,
    warnings,
  );

  fs.rmSync(exportDir, { recursive: true, force: true });
  fs.mkdirSync(corePackDir, { recursive: true });

  writeAiContext(rootDir, exportDir, mergedFiles);

  for (const relativePath of includedFiles) {
    copyFileIntoPack(rootDir, corePackDir, relativePath);
  }

  const version = {
    packVersion: manifest.packVersion,
    projectVersion: manifest.projectVersion,
    generatedAt: new Date().toISOString(),
    currentBranch: gitOutput(rootDir, ['branch', '--show-current']),
    currentCommit: gitOutput(rootDir, ['rev-parse', 'HEAD']),
    schemaVersion: manifest.schemaVersion,
    promptVersion: manifest.promptVersion,
    agentVersion: manifest.agentVersion,
    warnings,
  };
  fs.writeFileSync(
    path.join(exportDir, 'VERSION.json'),
    `${JSON.stringify(version, null, 2)}\n`,
    'utf8',
  );

  const finalFiles = [
    'AI_CONTEXT_COMPLETE.md',
    'FILE_INDEX.md',
    'VERSION.json',
    'CHECKSUMS.txt',
    ...collectPackFiles(corePackDir),
  ].sort();
  fs.writeFileSync(
    path.join(exportDir, 'FILE_INDEX.md'),
    buildFileIndex(finalFiles),
    'utf8',
  );

  fs.writeFileSync(
    path.join(exportDir, 'CHECKSUMS.txt'),
    buildChecksums(exportDir),
    'utf8',
  );

  return {
    exportDir,
    includedFiles,
    mergedFiles,
    warnings,
    version,
  };
}

export function compileExcludePolicy(entries, warnings = []) {
  const pathRules = [];
  const contentRiskHints = [];

  for (const rawEntry of entries) {
    if (typeof rawEntry !== 'string' || rawEntry.trim() === '') {
      warnings.push(`Unrecognized exclude rule ignored: ${String(rawEntry)}`);
      continue;
    }

    const entry = rawEntry.trim();
    if (contentRiskHintNames.has(entry)) {
      contentRiskHints.push(entry);
      continue;
    }

    const normalized = normalizeRelativeRule(entry);
    if (isUnsafeRelativePath(normalized)) {
      throw new Error(`Exclude rule escapes project root: ${entry}`);
    }

    if (entry === '.env.*') {
      pathRules.push({ type: 'env-family' });
      continue;
    }

    if (/^\*\.[^*/?]+$/.test(entry)) {
      pathRules.push({ type: 'suffix', value: entry.slice(1).toLowerCase() });
      continue;
    }

    if (entry.includes('*') || entry.includes('?')) {
      warnings.push(`Unrecognized exclude rule ignored: ${entry}`);
      continue;
    }

    pathRules.push({ type: 'path', value: normalized });
  }

  return {
    contentRiskHints,
    pathRules,
    matches(relativePath) {
      const normalized = normalizeRelativeRule(relativePath);
      return pathRules.some((rule) => {
        if (rule.type === 'env-family') {
          const basename = path.posix.basename(normalized);
          return basename.startsWith('.env.');
        }
        if (rule.type === 'suffix') {
          return normalized.toLowerCase().endsWith(rule.value);
        }
        return normalized === rule.value || normalized.startsWith(`${rule.value}/`);
      });
    },
  };
}

export function isHardBlockedPath(relativePath) {
  const normalized = normalizeRelativeRule(relativePath);
  const lowerPath = normalized.toLowerCase();
  const parts = lowerPath.split('/');
  const basename = parts.at(-1) ?? '';

  if (parts.some((part) => hardBlockedDirNames.has(part))) return true;
  if (basename === '.env' || basename.startsWith('.env.')) return true;
  if (hardBlockedExtensions.has(path.posix.extname(lowerPath))) return true;
  return hardBlockedSuffixes.some((suffix) => lowerPath.endsWith(suffix));
}

function validateRequiredFiles(rootDir, requiredFiles) {
  const missing = [];
  for (const relativePath of requiredFiles) {
    const absolutePath = resolveProjectPath(rootDir, relativePath, 'Required file');
    if (!fs.existsSync(absolutePath)) missing.push(relativePath);
  }
  if (missing.length > 0) {
    throw new Error(`Missing required files: ${missing.join(', ')}`);
  }
}

function collectFilesFromEntries(
  rootDir,
  entries,
  excludePolicy,
  warnings,
  sortResult,
) {
  const files = new Set();

  for (const entry of entries) {
    const absolutePath = resolveProjectPath(rootDir, entry, 'Manifest path');
    if (!fs.existsSync(absolutePath)) {
      warnings.push(`Manifest path does not exist and was skipped: ${entry}`);
      continue;
    }

    const entryRelativePath = toPosix(path.relative(rootDir, absolutePath));
    if (isExcluded(entryRelativePath, excludePolicy)) continue;

    for (const file of walkFiles(rootDir, absolutePath, excludePolicy)) {
      const relativePath = toPosix(path.relative(rootDir, file));
      if (isAllowedTextFile(relativePath, excludePolicy)) {
        files.add(relativePath);
      }
    }
  }

  const result = [...files];
  return sortResult ? result.sort() : result;
}

function* walkFiles(rootDir, startPath, excludePolicy) {
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
    const relativePath = toPosix(path.relative(rootDir, fullPath));
    if (isExcluded(relativePath, excludePolicy)) continue;

    if (entry.isDirectory()) {
      yield* walkFiles(rootDir, fullPath, excludePolicy);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function isAllowedTextFile(relativePath, excludePolicy) {
  if (isExcluded(relativePath, excludePolicy)) return false;
  return textExtensions.has(path.posix.extname(toPosix(relativePath)).toLowerCase());
}

function isExcluded(relativePath, excludePolicy) {
  return isHardBlockedPath(relativePath) || excludePolicy.matches(relativePath);
}

function writeAiContext(rootDir, exportDir, mergedFiles) {
  const contextParts = [
    '# AI Context Complete',
    '',
    '由正式项目文件生成。此导出包不是唯一正式来源（Source of Truth）。',
    '',
  ];

  for (const relativePath of mergedFiles) {
    const source = fs.readFileSync(path.join(rootDir, ...relativePath.split('/')), 'utf8');
    const metadata = extractFrontMatter(source);
    contextParts.push('---');
    contextParts.push(`SOURCE FILE: ${relativePath}`);
    contextParts.push(`DOCUMENT STATUS: ${metadata.status ?? 'unknown'}`);
    contextParts.push(`DOCUMENT VERSION: ${metadata.version ?? 'unknown'}`);
    contextParts.push('---');
    contextParts.push('');
    contextParts.push(source);
    contextParts.push('');
  }

  fs.writeFileSync(
    path.join(exportDir, 'AI_CONTEXT_COMPLETE.md'),
    contextParts.join('\n'),
    'utf8',
  );
}

function scanForBlockingSecrets(
  rootDir,
  relativeFiles,
  contentRiskHints,
  warnings,
) {
  const highConfidencePatterns = [
    { label: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    {
      label: 'service role key',
      pattern:
        /\b(?:[A-Z0-9]+_)*SERVICE_ROLE(?:_KEY)?\b\s*[:=]\s*['"]?[A-Za-z0-9._-]{12,}/i,
    },
    { label: 'bearer token', pattern: /Bearer\s+[A-Za-z0-9._~+/=-]{16,}/ },
    { label: 'github token', pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
    { label: 'openai style key', pattern: /sk-[A-Za-z0-9_-]{20,}/ },
    { label: 'google api key', pattern: /AIza[A-Za-z0-9_-]{20,}/ },
  ];
  const warningPatterns = [
    {
      label: 'possible email',
      pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    },
    { label: 'possible phone', pattern: /\b1[3-9]\d{9}\b/ },
  ];
  const contentHintPatterns = {
    'API Key': /\bapi[ _-]?key\b\s*[:=]\s*['"]?([A-Za-z0-9._~+/=-]{20,})/i,
    Secret: /\bsecret\b\s*[:=]\s*['"]?([A-Za-z0-9._~+/=-]{20,})/i,
    Token: /\btoken\b\s*[:=]\s*['"]?([A-Za-z0-9._~+/=-]{20,})/i,
  };

  for (const relativePath of relativeFiles) {
    const source = fs.readFileSync(
      path.join(rootDir, ...relativePath.split('/')),
      'utf8',
    );
    for (const rule of highConfidencePatterns) {
      if (rule.pattern.test(source)) {
        throw new Error(
          `Blocking secret-like content detected in ${relativePath}: ${rule.label}`,
        );
      }
    }
    for (const hint of contentRiskHints) {
      const pattern = contentHintPatterns[hint];
      if (pattern?.test(source)) {
        throw new Error(
          `Blocking content risk hint detected in ${relativePath}: ${hint}`,
        );
      }
    }
    for (const rule of warningPatterns) {
      if (rule.pattern.test(source)) {
        warnings.push(`Manual review: ${relativePath} contains ${rule.label}`);
      }
    }
  }
}

function copyFileIntoPack(rootDir, corePackDir, relativePath) {
  const targetPath = path.join(corePackDir, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(
    path.join(rootDir, ...relativePath.split('/')),
    targetPath,
  );
}

function collectPackFiles(corePackDir) {
  if (!fs.existsSync(corePackDir)) return [];
  return [...walkOutputFiles(corePackDir)]
    .map((file) => `AI-Core-Pack/${toPosix(path.relative(corePackDir, file))}`)
    .sort();
}

function buildFileIndex(finalFiles) {
  return ['# File Index', '', ...finalFiles.map((file) => `- ${file}`), ''].join(
    '\n',
  );
}

function buildChecksums(exportDir) {
  const checksums = [];
  for (const file of walkOutputFiles(exportDir)) {
    const relativePath = toPosix(path.relative(exportDir, file));
    if (relativePath === 'CHECKSUMS.txt') continue;
    const hash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(file))
      .digest('hex');
    checksums.push({ hash, relativePath });
  }
  checksums.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath),
  );
  return `${checksums
    .map(({ hash, relativePath }) => `${hash}  ${relativePath}`)
    .join('\n')}\n`;
}

function* walkOutputFiles(startPath) {
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
      yield* walkOutputFiles(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function extractFrontMatter(source) {
  const normalized = source.replaceAll('\r\n', '\n');
  if (!normalized.startsWith('---\n')) return {};
  const endIndex = normalized.indexOf('\n---', 4);
  if (endIndex === -1) return {};
  const block = normalized.slice(4, endIndex).split('\n');
  return Object.fromEntries(
    block
      .map((line) => line.match(/^([A-Za-z_]+):\s*(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].trim()]),
  );
}

function resolveProjectPath(rootDir, relativePath, label) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error(`${label} must be a non-empty relative path.`);
  }
  const normalized = normalizeRelativeRule(relativePath);
  if (isUnsafeRelativePath(normalized)) {
    throw new Error(`${label} escapes project root: ${relativePath}`);
  }
  const resolved = path.resolve(rootDir, ...normalized.split('/'));
  const relative = path.relative(rootDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes project root: ${relativePath}`);
  }
  return resolved;
}

function normalizeRelativeRule(value) {
  return toPosix(String(value))
    .replace(/^\.\/+/, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

function isUnsafeRelativePath(value) {
  return (
    value === '' ||
    path.posix.isAbsolute(value) ||
    /^[A-Za-z]:\//.test(value) ||
    value.split('/').includes('..')
  );
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function toPosix(value) {
  return value.replaceAll('\\', '/');
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  const result = buildAiHandoff();
  console.log('AI handoff export complete');
  console.log(
    `Generated ${result.mergedFiles.length} merged source files and ${result.includedFiles.length} packed files.`,
  );
  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }
}
