export function nutritionAgent(data) {
  const findings = [];
  const recommendations = [];
  const warningFlags = [];
  const risks = ['low'];
  const nutrition = data.nutrition ?? {};
  const bodyWeight = Number(data.bodyWeight ?? 0);
  const proteinTarget = bodyWeight * 1.6;
  const carbTarget = bodyWeight * 4;
  const fatTarget = bodyWeight * 0.8;

  if (Number(nutrition.proteinGram ?? 0) < proteinTarget) {
    findings.push(`蛋白质低于 ${Math.round(proteinTarget)}g/天目标，可能不利于保肌肉和恢复。`);
    recommendations.push('每餐安排优质蛋白，训练后补充 25-30g 蛋白。');
    risks.push('medium');
  }

  if (Number(nutrition.carbsGram ?? 0) < carbTarget && Number(data.monthlyRunningKm ?? 0) >= 180) {
    findings.push(`当前碳水低于约 ${Math.round(carbTarget)}g/天，高跑量阶段可能影响训练质量。`);
    recommendations.push('质量课和长距离前后提高米饭、面、土豆、燕麦或水果摄入。');
    risks.push('medium');
  }

  if (Number(nutrition.fatGram ?? 0) < fatTarget) {
    findings.push(`脂肪摄入低于约 ${Math.round(fatTarget)}g/天，可能影响激素健康。`);
    recommendations.push('加入橄榄油、坚果、牛油果、鸡蛋或深海鱼，避免长期极低脂。');
    risks.push('medium');
  }

  if (nutrition.ironRichFoods === false) {
    findings.push('今日缺少明确富铁食物。');
    recommendations.push('增加红肉、贝类、动物肝脏，或豆类和深绿叶菜搭配维 C 促进补铁。');
    warningFlags.push('高跑量女性跑者需关注铁蛋白和疲劳变化。');
  }

  if (nutrition.omega3Foods === false) {
    findings.push('今日缺少 Omega-3 来源。');
    recommendations.push('增加三文鱼、沙丁鱼、青花鱼等深海鱼，或选择合适的 Omega-3 来源。');
  }

  if (Number(nutrition.hydrationMl ?? 0) < 1800) {
    findings.push('饮水量低于 1800ml。');
    recommendations.push('补水不足会影响循环、训练体感和恢复，建议分时段补到 2L 左右。');
    risks.push('medium');
  }

  if (risks.filter((level) => level === 'medium').length >= 3) risks.push('high');

  return createAgentReport({
    agentName: '运动营养师 Agent',
    riskLevel: highestRisk(risks),
    summary: highestRisk(risks) === 'low' ? '今日营养支持基本充足。' : '今日营养需要优先补足能量、蛋白和关键脂肪酸。',
    findings,
    recommendations,
    warningFlags,
  });
}

function createAgentReport({ agentName, riskLevel = 'low', summary, findings = [], recommendations = [], warningFlags = [] }) {
  return { agentName, riskLevel, summary, findings, recommendations, warningFlags };
}

function highestRisk(levels) {
  if (levels.includes('high')) return 'high';
  if (levels.includes('medium')) return 'medium';
  return 'low';
}
