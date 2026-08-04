import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const rootDir = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(rootDir, ...relativePath.split('/')), 'utf8');

const statusSummaryFiles = [
  'PROJECT.md',
  'README.md',
  'project/README.md',
  'project/INDEX.md',
  'project/Roadmap.md',
  'project/Backlog.md',
  'project/sprints/Sprint-001-Foundation-Privacy-Portability.md',
  'project/sprints/Sprint-002-Brand-Foundation.md',
  'migration/AI_HANDOFF.md',
];

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

describe('Sprint 001 foundation review fixes', () => {
  test('uses CurrentStatus as the only current project status source', () => {
    const currentStatus = read('project/CurrentStatus.md');
    expect(currentStatus).toContain('Foundation 状态');
    expect(currentStatus).toContain('`Draft / Review`');
    expect(currentStatus).toContain('本次 Review Fix 尚未合并至 `main`');

    for (const relativePath of statusSummaryFiles) {
      const source = read(relativePath);
      expect(source, relativePath).not.toMatch(
        /Sprint 001[^\n]*(?:已合并完成|Merged \/ Completed|已合并并建立)/,
      );
    }

    const projectEntry = read('PROJECT.md');
    expect(projectEntry).toContain('project/CurrentStatus.md');
    expect(projectEntry).not.toContain('## 已确认事项');

    const sprint = read(
      'project/sprints/Sprint-001-Foundation-Privacy-Portability.md',
    );
    expect(sprint).toContain('status: draft');
    expect(sprint).toContain('## Review Findings');
    expect(sprint).toContain('## Resolution');
    expect(sprint).toContain('## Remaining Issues');
  });

  test('keeps Brand DNA as the only source for core brand wording', () => {
    for (const relativePath of brandFiles) {
      const source = read(relativePath);
      expect(source, relativePath).toMatch(/\nsource_of_truth: (true|false)\r?\n/);
      expect(source, relativePath).toMatch(/\nstatus: proposed\r?\n/);
      expect(source, relativePath).toMatch(/\nversion: \d+\.\d+\.\d+\r?\n/);
    }

    const brandDna = read('brand/00_BrandDNA.md');
    expect(brandDna).toContain('source_of_truth: true');

    const missionVision = read('brand/02_MissionVision.md');
    expect(missionVision).toContain('source_of_truth: false');
    expect(missionVision).toContain('基于 Brand DNA 的展开说明');
    expect(missionVision).not.toContain(
      '帮助每个人记住自己的成长轨迹，理解自己、找到自己，并通过持续行动成为自己。',
    );
    expect(missionVision).not.toContain(
      '让每个人都拥有一个真正理解自己、记得自己来时的路，并长期陪伴自己成长的 AI 伙伴。',
    );
    expect(missionVision).not.toContain(
      '我们不会替用户定义理想的样子，而会陪伴用户找到属于自己的答案。',
    );

    const sourceOfTruth = read('project/SourceOfTruth.md');
    expect(sourceOfTruth).toContain(
      '| 品牌核心、使命、愿景、承诺与核心命题 | `brand/00_BrandDNA.md` |',
    );
    expect(sourceOfTruth).toContain(
      '| 使命愿景的决策展开说明 | `brand/02_MissionVision.md`（派生说明，非正式原文来源） |',
    );

    for (const relativePath of [
      'brand/03_BrandValues.md',
      'brand/05_BrandVoice.md',
      'brand/06_ProductPrinciples.md',
    ]) {
      expect(read(relativePath), relativePath).toContain(
        '遵循 [Brand DNA](00_BrandDNA.md)',
      );
    }
  });

  test('records a decision for every privacy audit warning', () => {
    const review = read('security/PrivacyAudit-Review.md');
    expect(review).toContain('## 必须修复');
    expect(review).toContain('## 可接受风险');
    expect(review).toContain('## 后续优化');
    expect(review).toContain('| Warning 编号 | 风险等级 | 处理决定 | 负责人 | 状态 |');
    for (let index = 1; index <= 9; index += 1) {
      expect(review).toContain(`PA-${String(index).padStart(2, '0')}`);
    }
    expect(read('security/PrivacyAudit-Initial.md')).toContain(
      '[PrivacyAudit-Review.md](PrivacyAudit-Review.md)',
    );
  });
});
