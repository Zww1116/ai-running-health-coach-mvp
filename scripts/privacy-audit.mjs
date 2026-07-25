import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const highConfidenceRules = [
  {
    label: 'private key',
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    label: 'service_role key',
    pattern:
      /\b(?:[A-Z0-9]+_)*SERVICE_ROLE(?:_KEY)?\b\s*[:=]\s*['"]?([A-Za-z0-9._-]{12,})/gi,
  },
  {
    label: 'OpenAI-style API key',
    pattern: /sk-[A-Za-z0-9_-]{20,}/g,
  },
  {
    label: 'GitHub token',
    pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  },
  {
    label: 'Bearer token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/=-]{16,}/gi,
  },
];

const manualReviewRules = [
  {
    label: 'possible email',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  },
  {
    label: 'possible mainland China phone',
    pattern: /\b1[3-9]\d{9}\b/g,
  },
];

const preciseHealthFieldRules = [
  /\b(?:bodyWeight|weightKg|weight)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:heightCm|height)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:sleepHours|sleepDuration)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:monthlyRunningKm|weeklyRunningKm|distanceKm)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:bodyFat|bodyFatPercent)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:restingHeartRate|avgHeartRate|hrv)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
  /\b(?:cycleDay|menstrualCycleDay)\b\s*[:=]\s*["']?\d+(?:\.\d+)?/i,
];

export function runPrivacyAudit({ rootDir = process.cwd() } = {}) {
  const resolvedRoot = path.resolve(rootDir);
  const trackedFiles = listTrackedFiles(resolvedRoot);
  const highConfidenceFindings = [];
  const manualReviewFindings = [];
  let textFilesScanned = 0;
  let binaryFilesSkipped = 0;
  let unreadableFiles = 0;

  for (const relativePath of trackedFiles) {
    const absolutePath = resolveTrackedPath(resolvedRoot, relativePath);
    let buffer;
    try {
      buffer = fs.readFileSync(absolutePath);
    } catch {
      unreadableFiles += 1;
      manualReviewFindings.push({
        file: relativePath,
        label: 'tracked file could not be read',
      });
      continue;
    }

    if (isLikelyBinary(buffer)) {
      binaryFilesSkipped += 1;
      continue;
    }

    textFilesScanned += 1;
    const source = buffer.toString('utf8');
    const scanResult = scanTextContent(source);

    for (const finding of scanResult.highConfidence) {
      highConfidenceFindings.push({
        file: relativePath,
        label: finding.label,
        masked: finding.masked,
      });
    }
    for (const label of scanResult.manualReview) {
      manualReviewFindings.push({ file: relativePath, label });
    }
  }

  return {
    trackedFiles: trackedFiles.length,
    textFilesScanned,
    binaryFilesSkipped,
    unreadableFiles,
    highConfidenceFindings,
    manualReviewFindings,
  };
}

export function scanTextContent(source) {
  const highConfidence = [];
  const manualReview = [];

  for (const rule of highConfidenceRules) {
    const matches = [...source.matchAll(rule.pattern)];
    for (const match of matches) {
      const secretValue = match[1] ?? match[0];
      highConfidence.push({
        label: rule.label,
        masked: maskSecret(secretValue),
      });
    }
  }

  for (const rule of manualReviewRules) {
    if (rule.pattern.test(source)) {
      manualReview.push(rule.label);
    }
    rule.pattern.lastIndex = 0;
  }

  const preciseHealthFields = preciseHealthFieldRules.filter((rule) =>
    rule.test(source),
  ).length;
  if (preciseHealthFields >= 3) {
    manualReview.push('possible precise health profile');
  }

  return { highConfidence, manualReview };
}

export function isLikelyBinary(buffer) {
  if (buffer.includes(0)) return true;
  if (buffer.length === 0) return false;

  const sample = buffer.subarray(0, Math.min(buffer.length, 8192));
  let controlBytes = 0;
  for (const byte of sample) {
    if (byte < 7 || (byte > 13 && byte < 32)) controlBytes += 1;
  }
  return controlBytes / sample.length > 0.3;
}

export function maskSecret(value) {
  const normalized = String(value).replace(/\s+/g, '');
  if (normalized.length <= 8) return '****';
  const prefixLength = normalized.startsWith('sk-') ? 3 : 4;
  return `${normalized.slice(0, prefixLength)}****${normalized.slice(-4)}`;
}

function listTrackedFiles(rootDir) {
  const output = execFileSync('git', ['ls-files', '-z'], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output
    .split('\0')
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/'))
    .sort();
}

function resolveTrackedPath(rootDir, relativePath) {
  const resolved = path.resolve(rootDir, ...relativePath.split('/'));
  const relative = path.relative(rootDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Tracked path escapes project root: ${relativePath}`);
  }
  return resolved;
}

function printAuditResult(result) {
  console.log(`Tracked files inspected: ${result.trackedFiles}`);
  console.log(`Text files scanned: ${result.textFilesScanned}`);
  console.log(`Binary files skipped: ${result.binaryFilesSkipped}`);

  if (result.manualReviewFindings.length > 0) {
    console.warn(`Privacy audit warnings: ${result.manualReviewFindings.length}`);
    for (const finding of result.manualReviewFindings) {
      console.warn(`Warning: ${finding.file} - ${finding.label}`);
    }
  }

  if (result.highConfidenceFindings.length > 0) {
    console.error(
      `High-confidence secrets found: ${result.highConfidenceFindings.length}`,
    );
    for (const finding of result.highConfidenceFindings) {
      console.error(
        `High-confidence secret: ${finding.file} - ${finding.label} - ${finding.masked}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log('Privacy audit passed: no high-confidence secrets found.');
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  try {
    printAuditResult(runPrivacyAudit());
  } catch (error) {
    console.error(`Privacy audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
