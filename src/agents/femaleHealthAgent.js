export function femaleHealthAgent(data) {
  const findings = [];
  const recommendations = [];
  const warningFlags = [];
  const risks = ['low'];
  const nutrition = data.nutrition ?? {};
  const calories = Number(nutrition.calories ?? 0);
  const fatGram = Number(nutrition.fatGram ?? 0);
  const fatTarget = Number(data.bodyWeight ?? 0) * 0.8;

  if (data.menstrualPhase === 'menstruation') {
    findings.push('当前处于经期阶段，训练表现和体感可能自然波动。');
    recommendations.push('根据当天状态调整训练强度，腹痛、乏力或量多时优先舒适度。');
  }

  if (Number(data.fatigueLevel ?? 0) >= 7 && calories < 1800) {
    findings.push('疲劳感偏高且热量偏低，存在低能量可用性风险。');
    recommendations.push('今天先补足主食、蛋白和脂肪，再考虑训练质量。');
    risks.push('medium');
  }

  if (fatGram < fatTarget) {
    findings.push('脂肪摄入偏低，长期过低不利于雌激素和经期稳定。');
    recommendations.push('用坚果、鸡蛋、橄榄油或深海鱼温和补足脂肪，不需要极端控脂。');
    risks.push('medium');
  }

  if (Number(data.monthlyRunningKm ?? 0) >= 180 && Number(data.sleepHours ?? 0) < 7) {
    findings.push('长期高跑量叠加睡眠不足时，需要更关注经期、骨密度和恢复状态。');
    recommendations.push('连续睡眠不足时，把强度训练换成恢复日，并观察周期是否稳定。');
    warningFlags.push('若经期紊乱、持续疲劳或骨痛，应寻求专业评估。');
    risks.push('medium');
  }

  if (findings.length === 0) {
    findings.push('女性健康相关信号整体平稳。');
    recommendations.push('继续记录周期、疲劳、睡眠和训练表现之间的关系。');
  }

  return createAgentReport({
    agentName: '女性健康顾问 Agent',
    riskLevel: highestRisk(risks),
    summary: highestRisk(risks) === 'low' ? '当前女性健康信号平稳。' : '建议温和优先处理能量、睡眠和周期稳定性。',
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
