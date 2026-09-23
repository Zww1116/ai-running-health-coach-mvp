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
const approvedPositioning =
  '一个帮助人们保存成长轨迹、理解自身规律、找到个人方向，并在持续的记录、理解与选择中，一步一步成为自己的长期成长伙伴。';
const previousPositioning =
  '一个帮助人们保存成长轨迹、理解自身规律、找到个人方向，并通过长期行动逐渐成为自己的 AI 成长伙伴品牌。';
const approvedMissionDecision =
  'Mission 要求产品帮助用户持续保存可迁移的成长轨迹，通过记录、数据、经历与长期上下文促进理解，明确选择空间，并把理解与选择转化为可以执行和复盘的下一步。';
const approvedVisionDecision =
  'Vision 描述品牌希望长期实现的未来，但不能被用来提前扩大当前产品范围。母品牌面向未来公众，而当前 Health 仍处于创始人私人真实验证阶段；未来方向应保留可能性，而不是被解释为当前开发承诺。';
const approvedPromiseDecision =
  'Brand Promise 要求每一次产品和 AI 交互都尊重用户的主体性、解释依据与不确定性，并保留真实的选择空间。系统可以提出建议，但不能通过权威语气、评分、焦虑、羞耻或依赖机制替用户定义理想状态。';
const approvedCoreThesisDecision =
  'Core Thesis 约束人与技术的关系：用户始终是主角；AI、规则引擎和未来其他技术都只是可替换的能力提供者，不能成为最终决定者，也不能成为用户记忆、数据或长期成长资产的唯一载体。';
const approvedRelationshipArchetype =
  '一个记得你的经历、尊重你的节奏、能够帮助你看见规律，并陪伴你长期成长的可信赖伙伴。';
const approvedPersonalityDecisionRule =
  '当‘让用户感到被照顾’与‘保持事实准确’发生冲突时，不能用温暖牺牲诚实；当‘保持专业’与‘保留用户主体性’发生冲突时，不能用专业压过尊重。';
const approvedPersonalityRuleSummary =
  '尊重与诚实，是人格表达的底线；温度与专业必须建立在这两个底线之上。';
const approvedVoiceDecisionSummary =
  '真实 > 好听，清楚 > 炫技，尊重 > 说服，安全 > 温和。';
const approvedProductDecisionSummary =
  '最小化 > 多收集，控制权 > 自动化，长期利益 > 留存，安全 > 便利。';

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('Sprint 002 brand foundation', () => {
  test('approves reviewed brand sources while keeping later brand sources proposed', () => {
    for (const relativePath of brandFiles) {
      const absolutePath = path.join(rootDir, relativePath);
      expect(fs.existsSync(absolutePath), `${relativePath} should exist`).toBe(true);

      const source = fs.readFileSync(absolutePath, 'utf8');
      const expectedStatus = [
        'brand/00_BrandDNA.md',
        'brand/01_BrandPositioning.md',
        'brand/02_MissionVision.md',
        'brand/03_BrandValues.md',
        'brand/04_BrandPersonality.md',
        'brand/05_BrandVoice.md',
        'brand/06_ProductPrinciples.md',
      ].includes(relativePath)
        ? 'approved'
        : 'proposed';
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
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Sprint 002 — Brand Foundation Review');
    expect(currentStatus).toContain('`Approved / Completed`');

    expect(handoff).toContain('Brand DNA 文件整体：`Approved`');
    expect(handoff).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('AI 是可替换技术能力，不是品牌长期愿景的主体');
    expect(bootstrap).toContain('Brand DNA 已正式 `Approved`');
    expect(bootstrap).toContain('Brand Foundation 尚未整体批准');
    expect(bootstrap).toContain('AI 是可替换技术能力，不是品牌长期愿景的主体');
  });

  test('records the approved public mother-brand positioning and private Health validation', () => {
    const positioning = fs.readFileSync(
      path.join(rootDir, 'brand', '01_BrandPositioning.md'),
      'utf8',
    );
    const project = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf8');
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

    expect(positioning).toMatch(/\nstatus: approved\r?\n/);
    expect(positioning).toMatch(/\nversion: 0\.2\.0\r?\n/);
    expect(positioning).toContain('last_updated: 2026-08-18');
    expect(positioning).toContain('owner: founder');
    expect(positioning).toContain('source_of_truth: true');
    expect(positioning).toContain(approvedPositioning);
    expect(positioning).not.toContain(previousPositioning);
    expect(positioning).toContain(
      '人拥有越来越多的数据、建议和工具，却未必因此更加了解自己。',
    );
    expect(positioning).toContain('记住 → 理解 → 判断 → 行动 → 回看 → 成长');
    expect(positioning).toContain(
      '数据所有权不是价值链中的单独一步，而是贯穿整个价值链的基础原则和底线能力',
    );
    expect(positioning).toContain(
      '其他工具通常解决一次问题；本品牌保存一个人的长期上下文。',
    );
    expect(positioning).toContain(
      '其他系统往往告诉用户应该做什么；本品牌帮助用户理解自己为什么这样，并支持用户作出自己的选择。',
    );
    expect(positioning).toContain('母品牌面向未来公众');
    expect(positioning).toContain('当前 Health 产品先作为创始人的私人产品进行真实验证');
    expect(positioning).toContain('AI 是可替换的技术能力提供者');

    expect(project).toContain(
      '母品牌正式定位已批准，准确原文只从 [Brand Positioning](brand/01_BrandPositioning.md) 读取',
    );
    expect(project).not.toContain('并逐步成为自己的长期成长伙伴');

    expect(currentStatus).toContain('Brand Positioning：`Approved`');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('Brand Positioning：`Approved`');
    expect(handoff).toContain('母品牌面向未来公众');
    expect(handoff).toContain('当前 Health 产品处于创始人私人真实验证阶段');
    expect(bootstrap).toContain('Brand Positioning 已正式 `Approved`');
    expect(bootstrap).toContain('母品牌面向未来公众');
    expect(bootstrap).toContain('当前 Health 产品处于创始人私人真实验证阶段');
  });

  test('approves the Mission and Vision derived explanation without replacing Brand DNA', () => {
    const missionVision = fs.readFileSync(
      path.join(rootDir, 'brand', '02_MissionVision.md'),
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

    expect(missionVision).toMatch(/\nstatus: approved\r?\n/);
    expect(missionVision).toMatch(/\nversion: 0\.2\.0\r?\n/);
    expect(missionVision).toContain('last_updated: 2026-08-19');
    expect(missionVision).toContain('owner: founder');
    expect(missionVision).toContain('source_of_truth: false');
    expect(missionVision).toContain(approvedMissionDecision);
    expect(missionVision).toContain(approvedVisionDecision);
    expect(missionVision).toContain(approvedPromiseDecision);
    expect(missionVision).toContain(approvedCoreThesisDecision);
    expect(missionVision).toContain('未来公众母品牌 ≠ 当前立即开发公众 SaaS');
    expect(missionVision).toContain(
      '产品的成功不以“用户越来越依赖系统”为目标，而以“用户越来越理解自己、越来越能自主判断”为目标。',
    );
    expect(missionVision).toContain('记住 → 理解 → 判断 → 行动 → 回看 → 成长');
    expect(missionVision).toContain('具体 Mission 正式措辞始终回到 [Brand DNA](00_BrandDNA.md) 核对');
    expect(missionVision).not.toContain(approvedMission);
    expect(missionVision).not.toContain(approvedVision);
    expect(missionVision).not.toContain(approvedPromise);
    expect(missionVision).not.toContain(approvedCoreThesis);

    expect(currentStatus).toContain('Mission & Vision 派生说明：`Approved`');
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('Mission & Vision 派生说明：`Approved`');
    expect(handoff).toContain('派生说明不是正式原文来源');
    expect(bootstrap).toContain('Mission & Vision 派生说明已正式 `Approved`');
    expect(bootstrap).toContain('用户自主判断优先于 AI 依赖');
  });

  test('approves exactly eight Brand Values and keeps the decision rule separate', () => {
    const values = fs.readFileSync(
      path.join(rootDir, 'brand', '03_BrandValues.md'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    const checklist = fs.readFileSync(
      path.join(rootDir, 'brand', '10_FounderReviewChecklist.md'),
      'utf8',
    );
    const changelog = fs.readFileSync(
      path.join(rootDir, 'brand', 'CHANGELOG.md'),
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

    expect(values).toMatch(/\nstatus: approved\n/);
    expect(values).toMatch(/\nversion: 0\.2\.0\n/);
    expect(values).toContain('last_updated: 2026-08-21');
    expect(values).toContain('owner: founder');
    expect(values).toContain('source_of_truth: true');
    expect(values.match(/^## \d+\./gm)).toHaveLength(8);
    expect(values).toContain(
      '## 7. 技术辅助，人来决定 Technology Assists, Human Decides',
    );
    expect(values).not.toContain(
      '## 7. AI 辅助，人来决定 AI Assists, Human Decides',
    );
    expect(values).toContain('## Values Decision Rule');
    expect(values).toContain('这不是第九项 Brand Value');
    expect(values).toContain(
      '当价值观、产品目标或商业目标发生冲突时，人的安全、尊严、自主权与长期利益，优先于增长、效率、完成率和技术能力。',
    );
    expect(values).toContain('Brand Values 不是营销口号');

    expect(checklist).toContain('Brand Values 整体 Approved');
    expect(checklist).toContain('审核日期：2026-08-21');
    expect(changelog).toContain('Brand Values Founder Review 01 — 2026-08-21');
    expect(currentStatus).toContain('Brand Values：`Approved`');
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('正式价值观只有八项');
    expect(handoff).toContain('Values Decision Rule 不是第九项价值观');
    expect(bootstrap).toContain('Brand Values 已正式 `Approved`');
    expect(bootstrap).toContain('技术辅助，人来决定');
  });

  test('approves Brand Personality with its relationship archetype and decision rule', () => {
    const personality = fs.readFileSync(
      path.join(rootDir, 'brand', '04_BrandPersonality.md'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    const checklist = fs.readFileSync(
      path.join(rootDir, 'brand', '10_FounderReviewChecklist.md'),
      'utf8',
    );
    const changelog = fs.readFileSync(
      path.join(rootDir, 'brand', 'CHANGELOG.md'),
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

    expect(personality).toMatch(/\nstatus: approved\n/);
    expect(personality).toMatch(/\nversion: 0\.2\.0\n/);
    expect(personality).toContain('last_updated: 2026-09-01');
    expect(personality).toContain('owner: founder');
    expect(personality).toContain('source_of_truth: true');
    expect(personality).toContain('## Brand Relationship Archetype');
    expect(personality).toContain('**可信赖的长期伙伴**');
    expect(personality).toContain(approvedRelationshipArchetype);
    expect(personality.match(/^### \d+\./gm)).toHaveLength(8);
    expect(personality).toContain('## 人格层级');
    expect(personality).toContain('第一层｜核心感受');
    expect(personality).toContain('第二层｜判断方式');
    expect(personality).toContain('第三层｜关系模式');
    expect(personality).toContain('## Personality Decision Rule');
    expect(personality).toContain(approvedPersonalityDecisionRule);
    expect(personality).toContain(approvedPersonalityRuleSummary);
    expect(personality).toContain('AI 与技术不是品牌人格主体');
    expect(personality).not.toMatch(/^## \d+\. .*Value/gm);
    expect(personality).not.toContain(coreExpression);
    expect(personality).not.toContain(approvedMission);

    expect(checklist).toContain('Brand Personality 整体 Approved');
    expect(checklist).toContain('审核日期：2026-09-01');
    expect(changelog).toContain('Brand Personality Founder Review 01 — 2026-09-01');
    expect(currentStatus).toContain('Brand Personality：`Approved`');
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('Brand Relationship Archetype：`可信赖的长期伙伴`');
    expect(handoff).toContain('尊重与诚实是人格表达底线');
    expect(bootstrap).toContain('Brand Personality 已正式 `Approved`');
    expect(bootstrap).toContain('下一审核对象是 Brand Architecture');
  });

  test('approves Brand Voice as a cross-domain system with fifteen scenarios', () => {
    const voice = fs.readFileSync(
      path.join(rootDir, 'brand', '05_BrandVoice.md'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    const checklist = fs.readFileSync(
      path.join(rootDir, 'brand', '10_FounderReviewChecklist.md'),
      'utf8',
    );
    const changelog = fs.readFileSync(
      path.join(rootDir, 'brand', 'CHANGELOG.md'),
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
    const productPrinciples = fs.readFileSync(
      path.join(rootDir, 'brand', '06_ProductPrinciples.md'),
      'utf8',
    );

    expect(voice).toMatch(/\nstatus: approved\n/);
    expect(voice).toMatch(/\nversion: 0\.2\.0\n/);
    expect(voice).toContain('last_updated: 2026-09-19');
    expect(voice).toContain('owner: founder');
    expect(voice).toContain('source_of_truth: true');
    expect(voice).toContain('母品牌可继承的通用表达系统');
    expect(voice).toContain('专业、冷静、有温度、诚实且克制');

    expect(voice).toContain('## Brand Voice Principles');
    for (const principle of [
      '先理解，再表达 Understand Before Speaking',
      '事实、判断、建议分开 Separate Fact, Interpretation and Advice',
      '清楚，但不命令 Clear, Not Commanding',
      '温暖，但不表演情绪 Warm, Not Performative',
      '有个性，但不抢走用户主体性 Distinctive, Without Taking Over',
      '简洁优先，深度按需 Concise by Default, Deep When Needed',
    ]) {
      expect(voice).toContain(principle);
    }
    expect(voice).toContain('温度来自理解，而不是情绪词数量。');

    expect(voice).toContain('## Voice Response Architecture');
    expect(voice).toContain(
      'Understand → Facts → Interpretation → Uncertainty → Options → User Agency',
    );
    for (const step of [
      'Understand',
      'Facts',
      'Interpretation',
      'Uncertainty',
      'Options',
      'User Agency',
    ]) {
      expect(voice).toContain(`**${step}：**`);
    }

    expect(voice).toContain('## Directness Ladder');
    expect(voice).toContain('### Level 1 — 普通建议');
    expect(voice).toContain('### Level 2 — 需要注意');
    expect(voice).toContain('### Level 3 — 安全风险');

    expect(voice.match(/^\| \d+\. /gm)).toHaveLength(15);
    for (const scenario of [
      '1. 数据不足',
      '2. 状态下降',
      '3. 达成目标',
      '4. 没有完成计划',
      '5. 用户对自己失望',
      '6. 疼痛或高风险',
      '7. 可能涉及医疗问题',
      '8. 专家 Agent 意见冲突',
      '9. 用户选择与 AI 建议不同',
      '10. 长期没有进展',
      '11. 数据发生异常',
      '12. 用户只需要被倾听',
      '13. 用户明确不想要建议',
      '14. 用户改变过去的目标',
      '15. 系统记忆与用户当前表达冲突',
    ]) {
      expect(voice).toContain(`| ${scenario} |`);
    }

    expect(voice).toContain('## Memory Voice Rule');
    expect(voice).toContain('记忆应在有用时出现，而不是为了展示系统知道多少。');
    expect(voice).toContain('## Voice Decision Rule');
    expect(voice).toContain(approvedVoiceDecisionSummary);
    expect(voice).toContain('## Brand Voice Success Criteria');
    expect(voice).not.toContain(coreExpression);
    expect(voice).not.toContain(approvedMission);

    expect(productPrinciples).toMatch(/\nstatus: approved\r?\n/);
    expect(checklist).toContain('Brand Voice 整体 Approved');
    expect(checklist).toContain('审核日期：2026-09-19');
    expect(changelog).toContain('Brand Voice Founder Review 01 — 2026-09-19');
    expect(currentStatus).toContain('Brand Voice：`Approved`');
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('Brand Voice：`Approved`');
    expect(handoff).toContain('15 类正式场景');
    expect(bootstrap).toContain('Brand Voice 已正式 `Approved`');
    expect(bootstrap).toContain('下一审核对象是 Brand Architecture');
  });

  test('approves twelve mother-brand Product Principles and their review gate', () => {
    const principles = fs.readFileSync(
      path.join(rootDir, 'brand', '06_ProductPrinciples.md'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    const architecture = fs.readFileSync(
      path.join(rootDir, 'brand', '07_BrandArchitecture.md'),
      'utf8',
    );
    const naming = fs.readFileSync(
      path.join(rootDir, 'brand', '08_NamingBrief.md'),
      'utf8',
    );
    const guardrails = fs.readFileSync(
      path.join(rootDir, 'brand', '09_BrandGuardrails.md'),
      'utf8',
    );
    const checklist = fs.readFileSync(
      path.join(rootDir, 'brand', '10_FounderReviewChecklist.md'),
      'utf8',
    );
    const changelog = fs.readFileSync(
      path.join(rootDir, 'brand', 'CHANGELOG.md'),
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

    expect(principles).toMatch(/\nstatus: approved\n/);
    expect(principles).toMatch(/\nversion: 0\.2\.0\n/);
    expect(principles).toContain('last_updated: 2026-09-19');
    expect(principles).toContain('owner: product');
    expect(principles).toContain('source_of_truth: true');
    expect(principles).toContain('母品牌产品设计原则领域的正式来源');
    expect(principles.match(/^## \d{2}\. /gm)).toHaveLength(12);

    for (const principle of [
      '01. 记录是为了理解，不是为了监控',
      '02. 数据是成长轨迹，不是成绩单',
      '03. 重要建议必须解释且可追溯',
      '04. 最终决定权属于用户',
      '05. 行动优先于指标堆积',
      '06. 同时关注当下和长期趋势',
      '07. 不用焦虑、羞耻或攀比驱动用户',
      '08. 高风险领域必须尊重专业边界',
      '09. 所有核心资产必须可导出和迁移',
      '10. AI 服务商必须可替换',
      '11. 隐私默认最小化，敏感数据由用户控制',
      '12. 重要操作必须可确认、可撤销、可恢复',
    ]) {
      expect(principles).toContain(`## ${principle}`);
    }

    expect(principles).toContain('Respect Professional Boundaries in High-Stakes Domains');
    expect(principles).toContain('### Health');
    expect(principles).toContain('### Finance');
    expect(principles).toContain('### Legal');
    expect(principles).toContain('Privacy by Default, User-Controlled by Design');
    expect(principles).toContain('如果不收集这项数据，这个功能真的无法完成吗？');
    expect(principles).toContain('Confirmable, Reversible and Recoverable by Design');
    expect(principles).toContain('### Confirmable');
    expect(principles).toContain('### Reversible');
    expect(principles).toContain('### Recoverable');
    expect(principles).toContain('### Irreversible');

    expect(principles).toContain('## Product Decision Rule');
    expect(principles).toContain(approvedProductDecisionSummary);
    expect(principles).toContain('## Product Review Gate');
    expect(principles.match(/^### Gate \d+$/gm)).toHaveLength(8);
    expect(principles).toContain('## Product Review Result');
    for (const result of [
      '### PASS',
      '### PASS WITH CONDITIONS',
      '### FOUNDER REVIEW REQUIRED',
      '### BLOCKED',
    ]) {
      expect(principles).toContain(result);
    }
    expect(principles).toContain('Founder Private Validation');
    expect(principles).toContain('本次 Founder Review 批准的是 Product Principles governance');
    expect(principles).not.toContain(coreExpression);
    expect(principles).not.toContain(approvedMission);

    for (const source of [architecture, naming, guardrails]) {
      expect(source).toMatch(/\nstatus: proposed\r?\n/);
    }
    expect(checklist).toContain('Product Principles 整体 Approved');
    expect(checklist).toContain('审核日期：2026-09-19');
    expect(changelog).toContain('Product Principles Founder Review 01 — 2026-09-19');
    expect(currentStatus).toContain('Product Principles：`Approved`');
    expect(currentStatus).toContain('下一审核对象：Brand Architecture');
    expect(currentStatus).toContain('Brand Foundation：`Proposed / Founder Review`');
    expect(handoff).toContain('Product Principles：`Approved`');
    expect(handoff).toContain('正式共有 12 项母品牌 Product Principles');
    expect(bootstrap).toContain('Product Principles 已正式 `Approved`');
    expect(bootstrap).toContain('下一审核对象是 Brand Architecture');
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
