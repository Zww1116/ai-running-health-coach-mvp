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

const approvedFoundationFiles = [
  'PROJECT.md',
  'project/CurrentStatus.md',
  'project/SourceOfTruth.md',
  'project/decisions/README.md',
  'project/decisions/ADR-0001-Single-Repository.md',
  'project/decisions/ADR-0002-Private-Data-Separation.md',
  'project/decisions/ADR-0003-Replaceable-AI-Providers.md',
  'project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md',
  'migration/AI_HANDOFF.md',
  'security/PrivacyModel.md',
  'security/DataClassification.md',
  'security/AIDataSharingPolicy.md',
  'security/SecretsPolicy.md',
];

describe('Sprint 001 foundation governance', () => {
  test('records founder approval while keeping CurrentStatus authoritative', () => {
    const currentStatus = read('project/CurrentStatus.md');
    expect(currentStatus).toContain('Foundation 状态');
    expect(currentStatus).toContain('`Approved / Completed`');
    expect(currentStatus).toContain('Sprint 002 — Brand Foundation Review');
    expect(currentStatus).toContain('`Proposed / Founder Review`');
    expect(currentStatus).toContain(
      '将 `proposed` 文件合并进 `main`，只表示将草案纳入版本管理，不代表内容已经转为 `approved`',
    );

    for (const relativePath of statusSummaryFiles) {
      const source = read(relativePath);
      expect(source, relativePath).not.toMatch(
        /Foundation[^\n]*(?:Draft \/ Review|尚未完成最终治理审批|仍未获得治理批准)/,
      );
    }

    for (const relativePath of approvedFoundationFiles) {
      expect(read(relativePath), relativePath).toMatch(/\nstatus: approved\r?\n/);
    }

    const projectEntry = read('PROJECT.md');
    expect(projectEntry).toContain('project/CurrentStatus.md');

    const sprint = read(
      'project/sprints/Sprint-001-Foundation-Privacy-Portability.md',
    );
    expect(sprint).toContain('status: approved');
    expect(sprint).toContain('`Approved / Completed`');
    expect(sprint).toContain('## Review Findings');
    expect(sprint).toContain('## Resolution');
    expect(sprint).toContain('## Remaining Issues');

    const decisions = read('project/decisions/README.md');
    for (let index = 1; index <= 4; index += 1) {
      expect(decisions).toContain(`ADR-000${index}`);
      expect(read(`project/decisions/ADR-000${index}-${[
        'Single-Repository',
        'Private-Data-Separation',
        'Replaceable-AI-Providers',
        'Repository-Visibility-And-Licensing',
      ][index - 1]}.md`)).toContain('`Approved`');
    }

    const repositoryDecision = read(
      'project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md',
    );
    expect(repositoryDecision).toContain('当前公开仓库属于过渡状态');
    expect(repositoryDecision).toContain('当前不添加开源许可证');
    expect(repositoryDecision).toContain('默认保留全部权利');

    const manifest = JSON.parse(read('migration/manifest.json'));
    expect(manifest.governance).toMatchObject({
      foundationStatus: 'Approved / Completed',
      brandFoundationStatus: 'Proposed / Founder Review',
      brandNameStatus: 'undetermined',
      aiProviders: 'replaceable',
      repositoryStatus: 'public transition toward private source asset management',
      licenseStatus: 'no open-source license; all rights reserved by default',
    });

    const handoff = read('migration/AI_HANDOFF.md');
    expect(handoff).toContain('Foundation 状态为 `Approved / Completed`');
    expect(handoff).toContain('当前不授予开源许可证');
    expect(read('migration/NEW_AI_BOOTSTRAP_PROMPT.md')).toContain(
      '合并 proposed 文件不等于 Brand Approval',
    );
  });

  test('keeps Brand DNA as the only source for core brand wording', () => {
    for (const relativePath of brandFiles) {
      const source = read(relativePath);
      const expectedStatus = [
        'brand/00_BrandDNA.md',
        'brand/01_BrandPositioning.md',
        'brand/02_MissionVision.md',
        'brand/03_BrandValues.md',
      ].includes(relativePath)
        ? 'approved'
        : 'proposed';
      expect(source, relativePath).toMatch(/\nsource_of_truth: (true|false)\r?\n/);
      expect(source, relativePath).toMatch(
        new RegExp(`\\nstatus: ${expectedStatus}\\r?\\n`),
      );
      expect(source, relativePath).toMatch(/\nversion: \d+\.\d+\.\d+\r?\n/);
    }

    const brandDna = read('brand/00_BrandDNA.md');
    expect(brandDna).toContain('source_of_truth: true');

    const missionVision = read('brand/02_MissionVision.md');
    expect(missionVision).toContain('source_of_truth: false');
    expect(missionVision).toContain('基于 Brand DNA 的展开说明');
    expect(missionVision).not.toContain(
      '帮助人们记住自己的成长轨迹，在持续的记录、理解与选择中找到自己，并一步一步成为自己。',
    );
    expect(missionVision).not.toContain(
      '让每个人都拥有一个记得自己来时的路、真正理解自己，并能够长期陪伴自己成长的伙伴。',
    );
    expect(missionVision).not.toContain(
      '我们不会替用户定义理想的样子，而会陪伴用户找到属于自己的答案。',
    );
    expect(missionVision).not.toContain('人不是被工具塑造的。');
    expect(missionVision).not.toContain(
      '好的技术应该帮助人更清楚地看见自己，并成为自己。',
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
