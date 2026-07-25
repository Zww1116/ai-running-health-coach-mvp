import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, describe, expect, test } from 'vitest';

const auditScript = path.join(process.cwd(), 'scripts', 'privacy-audit.mjs');
const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('privacy audit', () => {
  test('fails on a tracked high-confidence secret and masks the value', () => {
    const fixtureRoot = makeGitFixture();
    const secret = `sk-${'a'.repeat(32)}`;
    fs.writeFileSync(path.join(fixtureRoot, 'secret.txt'), `OPENAI_API_KEY=${secret}\n`);
    git(fixtureRoot, ['add', 'secret.txt']);

    const result = runAudit(fixtureRoot);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('High-confidence secret');
    expect(output).not.toContain(secret);
    expect(output).toContain('sk-');
    expect(output).toContain('****');
  });

  test('detects a conventional Supabase service role environment variable', () => {
    const fixtureRoot = makeGitFixture();
    const secret = `eyJ${'c'.repeat(36)}`;
    fs.writeFileSync(
      path.join(fixtureRoot, 'config.txt'),
      `SUPABASE_SERVICE_ROLE_KEY=${secret}\n`,
    );
    git(fixtureRoot, ['add', 'config.txt']);

    const result = runAudit(fixtureRoot);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toContain('service_role key');
    expect(output).not.toContain(secret);
  });

  test('warns for possible personal information without echoing private values', () => {
    const fixtureRoot = makeGitFixture();
    const email = `runner${'@'}example.com`;
    const phone = `138${'12345678'}`;
    const profile = [
      `email: ${email}`,
      `phone: ${phone}`,
      'bodyWeight: 50',
      'sleepHours: 6.5',
      'monthlyRunningKm: 200',
    ].join('\n');
    fs.writeFileSync(path.join(fixtureRoot, 'profile.txt'), profile);
    git(fixtureRoot, ['add', 'profile.txt']);

    const result = runAudit(fixtureRoot);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).toBe(0);
    expect(output).toContain('Privacy audit warnings');
    expect(output).toContain('possible email');
    expect(output).toContain('possible mainland China phone');
    expect(output).toContain('possible precise health profile');
    expect(output).not.toContain(email);
    expect(output).not.toContain(phone);
  });

  test('skips binary tracked files', () => {
    const fixtureRoot = makeGitFixture();
    const secret = `sk-${'b'.repeat(32)}`;
    fs.writeFileSync(
      path.join(fixtureRoot, 'binary.bin'),
      Buffer.concat([Buffer.from([0, 1, 2, 3]), Buffer.from(secret)]),
    );
    git(fixtureRoot, ['add', 'binary.bin']);

    const result = runAudit(fixtureRoot);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Binary files skipped: 1');
  });
});

function makeGitFixture() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'privacy-audit-'));
  temporaryDirectories.push(fixtureRoot);
  git(fixtureRoot, ['init', '--quiet']);
  fs.writeFileSync(path.join(fixtureRoot, 'safe.txt'), 'safe tracked text\n');
  git(fixtureRoot, ['add', 'safe.txt']);
  return fixtureRoot;
}

function git(cwd, args) {
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function runAudit(cwd) {
  return spawnSync(process.execPath, [auditScript], {
    cwd,
    encoding: 'utf8',
  });
}
