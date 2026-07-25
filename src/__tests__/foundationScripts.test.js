import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const rootDir = process.cwd();

function runNodeScript(scriptPath) {
  return execFileSync(process.execPath, [scriptPath], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

describe('project foundation scripts', () => {
  test('validates the Sprint 001 foundation files', () => {
    const output = runNodeScript(path.join(rootDir, 'scripts', 'validate-foundation.mjs'));

    expect(output).toContain('Foundation validation passed');
  }, 15000);

  test('exports a portable AI handoff pack without private data directories', () => {
    const output = runNodeScript(path.join(rootDir, 'scripts', 'build-ai-handoff.mjs'));
    const exportDir = path.join(rootDir, 'exports');

    expect(output).toContain('AI handoff export complete');
    expect(fs.existsSync(path.join(exportDir, 'AI_CONTEXT_COMPLETE.md'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'FILE_INDEX.md'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'VERSION.json'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'CHECKSUMS.txt'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', 'private-data'))).toBe(false);
    expect(fs.existsSync(path.join(exportDir, 'AI-Core-Pack', '.env'))).toBe(false);
  });
});
