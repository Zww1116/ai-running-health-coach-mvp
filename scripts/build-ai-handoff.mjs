import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'migration', 'manifest.json');
const exportDir = path.join(rootDir, 'exports');
const corePackDir = path.join(exportDir, 'AI-Core-Pack');
const textExtensions = new Set(['.md', '.json', '.js', '.jsx', '.mjs', '.css', '.html', '.sql', '.yml', '.yaml', '.txt']);
const blockedDirNames = new Set(['node_modules', 'dist', 'exports', 'backups', 'private-data', 'private-profile', '.git']);

const manifest = readJson(manifestPath);
const warnings = [];

validateRequiredFiles(manifest.requiredFiles ?? []);
const includedFiles = collectIncludedFiles(manifest.include ?? []);
scanForBlockingSecrets(includedFiles);

fs.rmSync(exportDir, { recursive: true, force: true });
fs.mkdirSync(corePackDir, { recursive: true });

const mergedFiles = collectMergeFiles(manifest.mergeOrder ?? []);
const contextParts = [
  '# AI Context Complete',
  '',
  'Generated from formal project files. This export is not a source of truth.',
  '',
];

for (const relativePath of mergedFiles) {
  const absolutePath = path.join(rootDir, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const metadata = extractFrontMatter(source);
  contextParts.push('---');
  contextParts.push(`SOURCE FILE: ${toPosix(relativePath)}`);
  contextParts.push(`DOCUMENT STATUS: ${metadata.status ?? 'unknown'}`);
  contextParts.push(`DOCUMENT VERSION: ${metadata.version ?? 'unknown'}`);
  contextParts.push('---');
  contextParts.push('');
  contextParts.push(source);
  contextParts.push('');
}

fs.writeFileSync(path.join(exportDir, 'AI_CONTEXT_COMPLETE.md'), contextParts.join('\n'), 'utf8');

for (const relativePath of includedFiles) {
  copyFileIntoPack(relativePath);
}

const fileIndex = buildFileIndex(exportDir);
fs.writeFileSync(path.join(exportDir, 'FILE_INDEX.md'), fileIndex, 'utf8');

const version = {
  packVersion: manifest.packVersion,
  generatedAt: new Date().toISOString(),
  currentBranch: gitOutput(['branch', '--show-current']),
  currentCommit: gitOutput(['rev-parse', 'HEAD']),
  schemaVersion: manifest.schemaVersion,
  promptVersion: manifest.promptVersion,
  agentVersion: manifest.agentVersion,
  warnings,
};
fs.writeFileSync(path.join(exportDir, 'VERSION.json'), `${JSON.stringify(version, null, 2)}\n`, 'utf8');

const checksums = buildChecksums(exportDir);
fs.writeFileSync(path.join(exportDir, 'CHECKSUMS.txt'), checksums, 'utf8');

console.log('AI handoff export complete');
console.log(`Generated ${mergedFiles.length} merged source files and ${includedFiles.length} packed files.`);
if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateRequiredFiles(requiredFiles) {
  const missing = requiredFiles.filter((relativePath) => !fs.existsSync(path.join(rootDir, relativePath)));
  if (missing.length > 0) {
    throw new Error(`Missing required files: ${missing.join(', ')}`);
  }
}

function collectIncludedFiles(includeEntries) {
  const files = new Set();
  for (const entry of includeEntries) {
    const absolutePath = path.join(rootDir, entry);
    if (!fs.existsSync(absolutePath)) continue;
    for (const file of walkFiles(absolutePath)) {
      const relativePath = path.relative(rootDir, file);
      if (isAllowedTextFile(relativePath)) files.add(toPosix(relativePath));
    }
  }
  return [...files].sort();
}

function collectMergeFiles(entries) {
  const files = new Set();
  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry);
    if (!fs.existsSync(absolutePath)) continue;
    if (fs.statSync(absolutePath).isDirectory()) {
      for (const file of walkFiles(absolutePath)) {
        const relativePath = path.relative(rootDir, file);
        if (isAllowedTextFile(relativePath)) files.add(toPosix(relativePath));
      }
    } else if (isAllowedTextFile(entry)) {
      files.add(toPosix(entry));
    }
  }
  return [...files];
}

function* walkFiles(startPath) {
  const stats = fs.statSync(startPath);
  if (stats.isFile()) {
    yield startPath;
    return;
  }

  for (const entry of fs.readdirSync(startPath, { withFileTypes: true })) {
    if (blockedDirNames.has(entry.name)) continue;
    const fullPath = path.join(startPath, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function isAllowedTextFile(relativePath) {
  const normalized = toPosix(relativePath);
  if (normalized.startsWith('.env')) return false;
  if ([...blockedDirNames].some((dirName) => normalized === dirName || normalized.startsWith(`${dirName}/`))) return false;
  return textExtensions.has(path.extname(normalized).toLowerCase());
}

function scanForBlockingSecrets(relativeFiles) {
  const highConfidencePatterns = [
    { label: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    { label: 'service role key', pattern: /service_role\s*[:=]\s*['"]?[A-Za-z0-9._-]{12,}/i },
    { label: 'bearer token', pattern: /Bearer\s+[A-Za-z0-9._~+/=-]{16,}/ },
    { label: 'github token', pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
    { label: 'openai style key', pattern: /sk-[A-Za-z0-9_-]{20,}/ },
    { label: 'google api key', pattern: /AIza[A-Za-z0-9_-]{20,}/ },
  ];
  const warningPatterns = [
    { label: 'possible email', pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
    { label: 'possible phone', pattern: /\b1[3-9]\d{9}\b/ },
  ];

  for (const relativePath of relativeFiles) {
    const source = fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
    for (const rule of highConfidencePatterns) {
      if (rule.pattern.test(source)) {
        throw new Error(`Blocking secret-like content detected in ${relativePath}: ${rule.label}`);
      }
    }
    for (const rule of warningPatterns) {
      if (rule.pattern.test(source)) {
        warnings.push({ file: relativePath, type: rule.label });
      }
    }
  }
}

function copyFileIntoPack(relativePath) {
  const targetPath = path.join(corePackDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(path.join(rootDir, relativePath), targetPath);
}

function buildFileIndex(startDir) {
  const lines = ['# File Index', ''];
  for (const file of walkFiles(startDir)) {
    lines.push(`- ${toPosix(path.relative(exportDir, file))}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildChecksums(startDir) {
  const lines = [];
  for (const file of walkFiles(startDir)) {
    const relativePath = toPosix(path.relative(exportDir, file));
    if (relativePath === 'CHECKSUMS.txt') continue;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    lines.push(`${hash}  ${relativePath}`);
  }
  return `${lines.sort().join('\n')}\n`;
}

function extractFrontMatter(source) {
  if (!source.startsWith('---\n')) return {};
  const endIndex = source.indexOf('\n---', 4);
  if (endIndex === -1) return {};
  const block = source.slice(4, endIndex).split('\n');
  return Object.fromEntries(
    block
      .map((line) => line.match(/^([A-Za-z_]+):\s*(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].trim()]),
  );
}

function gitOutput(args) {
  try {
    return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/');
}
