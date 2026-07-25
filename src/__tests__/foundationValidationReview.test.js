import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
  listValidationFiles,
  validateManifestExclusionFixture,
  validateJsonDocuments,
  validateMarkdownLinks,
} from '../../scripts/validate-foundation.mjs';

const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('foundation validation review fixes', () => {
  test('checks local Markdown links and ignores external, mailto, and anchors', () => {
    const rootDir = makeTempRoot();
    writeFile(rootDir, 'docs/existing.md', '# Existing\n');
    writeFile(
      rootDir,
      'docs/index.md',
      [
        '# Links',
        '',
        '[existing](./existing.md)',
        '[missing](./missing.md)',
        '[external](https://example.com)',
        '[mail](mailto:runner@example.com)',
        '[anchor](#section)',
        '[reference][missing-ref]',
        '',
        '[missing-ref]: ./missing-reference.md',
      ].join('\n'),
    );

    const result = validateMarkdownLinks(rootDir, ['docs/index.md']);

    expect(result.errors).toEqual([
      'Broken local Markdown link in docs/index.md: ./missing.md',
      'Broken local Markdown link in docs/index.md: ./missing-reference.md',
    ]);
    expect(result.warnings).toEqual([]);
  });

  test('includes untracked Markdown and JSON files in foundation validation', () => {
    const rootDir = makeTempRoot();
    writeFile(rootDir, 'tracked.md', '# Tracked\n');
    writeFile(rootDir, 'new/untracked.md', '# New\n');
    writeFile(rootDir, 'new/untracked.json', '{"ok":true}\n');
    writeFile(rootDir, 'node_modules/ignored.json', '{"ignored":true}\n');

    const files = listValidationFiles(rootDir, ['tracked.md']);

    expect(files).toContain('new/untracked.md');
    expect(files).toContain('new/untracked.json');
    expect(files).not.toContain('node_modules/ignored.json');
  });

  test('parses every JSON document and enforces JSON Schema metadata', () => {
    const rootDir = makeTempRoot();
    writeFile(rootDir, 'data/valid.json', '{"ok":true}\n');
    writeFile(rootDir, 'data/invalid.json', '{"ok":\n');
    writeFile(
      rootDir,
      'schemas/complete.schema.json',
      JSON.stringify({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'https://example.com/complete.schema.json',
        title: 'Complete',
        type: 'object',
      }),
    );
    writeFile(
      rootDir,
      'schemas/incomplete.schema.json',
      JSON.stringify({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: 'Incomplete',
        type: 'object',
      }),
    );

    const result = validateJsonDocuments(rootDir, [
      'data/valid.json',
      'data/invalid.json',
      'schemas/complete.schema.json',
      'schemas/incomplete.schema.json',
    ]);

    expect(result.errors.some((error) => error.startsWith('Invalid JSON in data/invalid.json:'))).toBe(true);
    expect(result.errors).toContain(
      'JSON Schema schemas/incomplete.schema.json is missing $id.',
    );
    expect(result.errors.some((error) => error.includes('schemas/complete.schema.json'))).toBe(false);
  });

  test('proves manifest excludes keep synthetic sensitive files out of an export', () => {
    const manifest = {
      packName: 'AI-Core-Pack',
      packVersion: '1.0.0',
      projectVersion: '1.0.0',
      schemaVersion: '1.0.0',
      promptVersion: '1.0.0',
      agentVersion: '1.0.0',
      exclude: [
        '.env',
        '.env.*',
        'private-data',
        'private-profile',
        'backups',
        '*.sqlite',
        '*.db',
        '*.pem',
        '*.key',
        '*.health-backup.json',
      ],
    };

    const result = validateManifestExclusionFixture(manifest);

    expect(result.errors).toEqual([]);
  });
});

function makeTempRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'foundation-validation-'));
  temporaryDirectories.push(rootDir);
  return rootDir;
}

function writeFile(rootDir, relativePath, contents) {
  const filePath = path.join(rootDir, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}
