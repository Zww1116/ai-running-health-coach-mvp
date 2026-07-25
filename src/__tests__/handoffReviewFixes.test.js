import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
  buildAiHandoff,
  compileExcludePolicy,
  isHardBlockedPath,
} from '../../scripts/build-ai-handoff.mjs';

const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('AI handoff review fixes', () => {
  test('applies manifest excludes separately from content risk hints', () => {
    const fixtureRoot = makeFixtureRoot();
    const exportDir = path.join(fixtureRoot, 'generated');
    const manifestPath = path.join(fixtureRoot, 'migration', 'manifest.json');

    const result = buildAiHandoff({
      rootDir: fixtureRoot,
      manifestPath,
      exportDir,
    });

    expect(result.warnings).toContain(
      'Unrecognized exclude rule ignored: docs/unsupported-*.txt',
    );
    expect(result.warnings.some((warning) => warning.includes('API Key'))).toBe(false);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', 'docs', 'safe.md'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', 'docs', 'excluded.md'))).toBe(false);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', 'docs', 'private'))).toBe(false);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', 'docs', 'session.txt'))).toBe(false);

    const context = fs.readFileSync(path.join(exportDir, 'AI_CONTEXT_COMPLETE.md'), 'utf8');
    expect(context).toContain('safe handoff content');
    expect(context).not.toContain('exact exclusion marker');
    expect(context).not.toContain('directory exclusion marker');
    expect(context).not.toContain('extension exclusion marker');
  });

  test('rejects exclude rules that escape the project root', () => {
    expect(() => compileExcludePolicy(['../outside'], [])).toThrow(
      'Exclude rule escapes project root',
    );
  });

  test('keeps hard safety blocks case-insensitive', () => {
    expect(isHardBlockedPath('PRIVATE-DATA/record.md')).toBe(true);
    expect(isHardBlockedPath('config/.ENV.PRODUCTION')).toBe(true);
    expect(isHardBlockedPath('archive/RECORDS.DB')).toBe(true);
  });

  test('uses content risk hints for generic credential assignment scanning', () => {
    const fixtureRoot = makeFixtureRoot();
    writeFile(
      fixtureRoot,
      'docs/credential.md',
      'API Key: abcdefghijklmnopqrstuvwxyz123456\n',
    );

    expect(() =>
      buildAiHandoff({
        rootDir: fixtureRoot,
        manifestPath: path.join(fixtureRoot, 'migration', 'manifest.json'),
        exportDir: path.join(fixtureRoot, 'generated'),
      }),
    ).toThrow('content risk hint');
  });

  test('scans merge-only files before writing the combined AI context', () => {
    const fixtureRoot = makeFixtureRoot();
    const manifestPath = path.join(fixtureRoot, 'migration', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.include = ['docs/safe.md'];
    manifest.mergeOrder = ['docs/merge-only.md'];
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    writeFile(
      fixtureRoot,
      'docs/merge-only.md',
      `SUPABASE_SERVICE_ROLE_KEY=${'a'.repeat(32)}\n`,
    );

    expect(() =>
      buildAiHandoff({
        rootDir: fixtureRoot,
        manifestPath,
        exportDir: path.join(fixtureRoot, 'generated'),
      }),
    ).toThrow('service role key');
  });

  test('indexes every final output and checksums every file except CHECKSUMS.txt', () => {
    const fixtureRoot = makeFixtureRoot();
    const exportDir = path.join(fixtureRoot, 'generated');

    buildAiHandoff({
      rootDir: fixtureRoot,
      manifestPath: path.join(fixtureRoot, 'migration', 'manifest.json'),
      exportDir,
    });

    const expectedFiles = [
      'AI_CONTEXT_COMPLETE.md',
      'AI-Core-Pack/docs/safe.md',
      'CHECKSUMS.txt',
      'FILE_INDEX.md',
      'VERSION.json',
    ];
    const index = fs.readFileSync(path.join(exportDir, 'FILE_INDEX.md'), 'utf8');
    for (const relativePath of expectedFiles) {
      expect(index).toContain(`- ${relativePath}`);
    }

    const checksumLines = fs
      .readFileSync(path.join(exportDir, 'CHECKSUMS.txt'), 'utf8')
      .trim()
      .split(/\r?\n/);
    const checksumPaths = checksumLines.map((line) => line.slice(66));

    expect([...checksumPaths].sort()).toEqual(
      expectedFiles.filter((file) => file !== 'CHECKSUMS.txt').sort(),
    );
    for (const line of checksumLines) {
      const expectedHash = line.slice(0, 64);
      const relativePath = line.slice(66);
      const actualHash = crypto
        .createHash('sha256')
        .update(fs.readFileSync(path.join(exportDir, ...relativePath.split('/'))))
        .digest('hex');
      expect(actualHash).toBe(expectedHash);
    }
  });
});

function makeFixtureRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'handoff-review-'));
  temporaryDirectories.push(rootDir);

  writeFile(
    rootDir,
    'docs/safe.md',
    '---\nstatus: approved\nversion: 1.0.0\n---\n# Safe\n\nsafe handoff content\n',
  );
  writeFile(rootDir, 'docs/excluded.md', 'exact exclusion marker\n');
  writeFile(rootDir, 'docs/private/note.md', 'directory exclusion marker\n');
  writeFile(rootDir, 'docs/session.txt', 'extension exclusion marker\n');
  writeFile(
    rootDir,
    'migration/manifest.json',
    `${JSON.stringify(
      {
        packName: 'AI-Core-Pack',
        packVersion: '1.0.0',
        projectVersion: '1.0.0',
        schemaVersion: '1.0.0',
        promptVersion: '1.0.0',
        agentVersion: '1.0.0',
        include: ['docs'],
        exclude: [
          'docs/excluded.md',
          'docs/private',
          '*.txt',
          'docs/unsupported-*.txt',
          'API Key',
          'Secret',
          'Token',
        ],
        mergeOrder: ['docs'],
        requiredFiles: ['docs/safe.md'],
      },
      null,
      2,
    )}\n`,
  );

  return rootDir;
}

function writeFile(rootDir, relativePath, contents) {
  const filePath = path.join(rootDir, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}
