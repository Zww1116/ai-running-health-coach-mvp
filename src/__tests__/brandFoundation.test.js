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
const approvedMission =
  '帮助人们记住自己的成长轨迹，在持续的记录、理解与选择中找到自己，并一步一步成为自己。';
const previousMission =
  '帮助每个人记住自己的成长轨迹，理解自己、找到自己，并通过持续行动成为自己。';
const approvedVision =
  '让每个人都拥有一个记得自己来时的路、真正理解自己，并能够长期陪伴自己成长的伙伴。';
const previousVision =
  '让每个人都拥有一个真正理解自己、记得自己来时的路，并长期陪伴自己成长的 AI 伙伴。';
const approvedPromise =
  '我们不会替用户定义理想的样子，而会陪伴用户找到属于自己的答案。';
const approvedCoreThesis =
  '人不是被工具塑造的。\n\n好的技术应该帮助人更清楚地看见自己，并成为自己。';
const previousCoreThesis =
  '人不是被 AI 塑造的。\n\n人是在 AI 的陪伴下，更清楚地成为自己。';

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('Sprint 002 brand foundation', () => {
  test('approves only Brand DNA while keeping other brand sources proposed', () => {
    for (const relativePath of brandFiles) {
      const absolutePath = path.join(rootDir, relativePath);
      expect(fs.existsSync(absolutePath), `${relativePath} should exist`).toBe(true);

      const source = fs.readFileSync(absolutePath, 'utf8');
      const expectedStatus =
        relativePath === 'brand/00_BrandDNA.md' ? 'approved' : 'proposed';
      expect(source).toMatch(/^---\r?\n/);
      expect(source).toMatch(new RegExp(`\\nstatus: ${expectedStatus}\\r?\\n`));
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

    expect(brandDna).toContain(coreExpression);
    expect(project).toContain(
      `[${coreExpression}](brand/00_BrandDNA.md)`,
    );
    expect(allBrandContent).not.toContain('看懂自己');
    expect(allBrandContent).toContain('[Brand Name Pending]');
    expect(allBrandContent).toContain('品牌名称尚未确定');
  });

  test('records complete Brand DNA approval without approving Brand Foundation', () => {
    const brandDna = fs.readFileSync(
      path.join(rootDir, 'brand', '00_BrandDNA.md'),
      'utf8',
    );
    const changelog = fs.readFileSync(
      path.join(rootDir, 'brand', 'CHANGELOG.md'),
      'utf8',
    );
    const checklist = fs.readFileSync(
      path.join(rootDir, 'brand', '10_FounderReviewChecklist.md'),
      'utf8',
    );
    const currentStatus = fs.readFileSync(
      path.join(rootDir, 'project', 'CurrentStatus.md'),
      'utf8',
    );
    const handoff = fs.readFileSync(
      path.join(rootDir, 'migration', 'AI_HANDOFF.md'),
      'utf8',
    );
    const bootstrap = fs.readFileSync(
      path.join(rootDir, 'migration', 'NEW_AI_BOOTSTRAP_PROMPT.md'),
      'utf8',
    );

    expect(brandDna).toMatch(/\nstatus: approved\r?\n/);
    expect(brandDna).toMatch(/\nversion: 0\.2\.0\r?\n/);
    for (const heading of [
      '核心表达',
      '品牌使命',
      '品牌愿景',
      '品牌承诺',
      '核心命题',
    ]) {
      expect(brandDna.replace(/\r\n/g, '\n')).toContain(
        `## ${heading}\n\n**Section Status:** \`Approved\``,
      );
    }
    expect(brandDna).toContain(coreExpression);
    expect(brandDna).toContain(approvedMission);
    expect(brandDna).toContain(approvedVision);
    expect(brandDna).toContain(approvedPromise);
    expect(brandDna).toContain(approvedCoreThesis);
    expect(brandDna).not.toContain(previousMission);
    expect(brandDna).not.toContain(previousVision);
    expect(brandDna).not.toContain(previousCoreThesis);

    expect(changelog).toContain('Brand DNA Founder Review 02 — 2026-08-15');
    expect(changelog).toContain('Vision：`Approved`');
    expect(changelog).toContain('Brand Promise：`Approved`');
    expect(changelog).toContain('Core Thesis：`Approved`');
    expect(changelog).toContain(
      'Brand DNA 文件整体状态由 `proposed` 调整为 `approved`',
    );
    expect(changelog).toContain('Brand Foundation 其余文件继续保持 `proposed`');
    expect(changelog).toContain('Brand DNA Founder Review 01');

    for (const item of [
      'Brand DNA 核心表达审核',
      'Mission 审核',
      'Vision 审核',
      'Promise 审核',
      'Core Thesis 审核',
      'Brand DNA 整体 Approved',
    ]) {
      expect(checklist).toContain(`- [x] ${item}`);
    }
    expect(checklist).toContain('创始人批准日期：2026-08-15');

    expect(currentStatus).toContain('Brand DNA：`Approved`');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(currentStatus).toContain('下一审核对象：Brand Positioning');
    expect(currentStatus).toContain('Sprint 002 — Brand Foundation Review');
    expect(currentStatus).toContain('`Approved / Completed`');

    expect(handoff).toContain('Brand DNA 文件整体：`Approved`');
    expect(handoff).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('AI 是可替换技术能力，不是品牌长期愿景的主体');
    expect(bootstrap).toContain('Brand DNA 已正式 `Approved`');
    expect(bootstrap).toContain('Brand Foundation 尚未整体批准');
    expect(bootstrap).toContain('AI 是可替换技术能力，不是品牌长期愿景的主体');
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
