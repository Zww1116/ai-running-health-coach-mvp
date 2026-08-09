import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { buildAiHandoff } from '../../scripts/build-ai-handoff.mjs';

const rootDir = process.cwd();
const temporaryDirectories = [];
const brandFiles = [
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
];
const coreExpression = '记住来路，理解自己，成为自己。';

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('Sprint 002 brand foundation', () => {
  test('provides every proposed brand source with complete front matter', () => {
    for (const relativePath of brandFiles) {
      const absolutePath = path.join(rootDir, relativePath);
      expect(fs.existsSync(absolutePath), `${relativePath} should exist`).toBe(true);

      const source = fs.readFileSync(absolutePath, 'utf8');
      expect(source).toMatch(/^---\r?\n/);
      expect(source).toMatch(/\nstatus: proposed\r?\n/);
      expect(source).toMatch(/\nversion: 0\.\d+\.\d+\r?\n/);
      expect(source).toMatch(/\nlast_updated: \d{4}-\d{2}-\d{2}\r?\n/);
      expect(source).toMatch(/\nowner: (founder|product)\r?\n/);
      expect(source).toMatch(/\nsource_of_truth: (true|false)\r?\n/);
      expect(source).toContain('已形成内容');
      expect(source).toContain('仍待确认事项');
    }
  });

  test('keeps the exact brand core and leaves the brand name undecided', () => {
    const brandDna = fs.readFileSync(
      path.join(rootDir, 'brand', '00_BrandDNA.md'),
      'utf8',
    );
    const project = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf8');
    const allBrandContent = brandFiles
      .map((relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8'))
      .join('\n');

    expect(brandDna).toMatch(
      new RegExp(`## 核心表达\\r?\\n\\r?\\n${coreExpression}`),
    );
    expect(project).toContain(
      `[${coreExpression}](brand/00_BrandDNA.md)`,
    );
    expect(allBrandContent).not.toContain('看懂自己');
    expect(allBrandContent).toContain('[Brand Name Pending]');
    expect(allBrandContent).toContain('品牌名称尚未确定');
  });

  test('exports every brand file in the declared order at pack version 0.2.2', () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'migration', 'manifest.json'), 'utf8'),
    );
    expect(manifest.packVersion).toBe('0.2.2');
    expect(manifest.projectVersion).toBe('0.2.2');
    expect(manifest.schemaVersion).toBe('0.1.0');
    expect(manifest.promptVersion).toBe('0.1.0');
    expect(manifest.agentVersion).toBe('0.1.0');

    const positions = brandFiles.map((file) => manifest.mergeOrder.indexOf(file));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-handoff-'));
    temporaryDirectories.push(exportDir);
    buildAiHandoff({ rootDir, exportDir });

    const context = fs.readFileSync(
      path.join(exportDir, 'AI_CONTEXT_COMPLETE.md'),
      'utf8',
    );
    let previousPosition = -1;
    for (const relativePath of brandFiles) {
      const contextPosition = context.indexOf(`SOURCE FILE: ${relativePath}`);
      expect(contextPosition, `${relativePath} should be merged`).toBeGreaterThan(
        previousPosition,
      );
      previousPosition = contextPosition;
      expect(
        fs.existsSync(path.join(exportDir, 'AI-Core-Pack', relativePath)),
        `${relativePath} should be copied`,
      ).toBe(true);
    }

    expect(JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')).version)
      .toBe('0.1.0');
  });
});
