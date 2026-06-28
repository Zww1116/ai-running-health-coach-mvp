export function strengthCoachAgent(data) {
  const findings = [];
  const recommendations = [];
  const warningFlags = [];
  const risks = ['low'];
  const strength = data.strength ?? {};
  const weeklyStrengthSessions = Number(data.weeklyStrengthSessions ?? 0);
  const sleepHours = Number(data.sleepHours ?? 0);

  if (weeklyStrengthSessions < 2) {
    findings.push(`本周力量训练 ${weeklyStrengthSessions} 次，低于跑者基础力量维护建议。`);
    recommendations.push('建议每周至少 2 次力量训练，优先臀腿、核心和单腿稳定。');
    risks.push('medium');
  }

  if (data.previousDayLowerBodyStrength === true) {
    findings.push('昨日有下肢力量训练，今天下肢神经肌肉可能仍在恢复。');
    recommendations.push('下肢力量训练后第二天避免高强度跑，选择轻松跑或恢复。');
  }

  if (strength.intensity === 'high' && sleepHours < 7) {
    findings.push('高强度力量训练叠加睡眠不足，肌肉恢复质量可能下降。');
    recommendations.push('降低训练量或减少大重量组数，优先动作质量。');
    risks.push('medium');
  }

  recommendations.push('保留臀腿、核心、上肢平衡训练，重点保护肌肉量和跑步经济性。');

  if (strength.trained && strength.bodyPart) {
    findings.push(`今日力量训练重点为${strength.bodyPart}，时长 ${strength.durationMin} 分钟。`);
  }

  return createAgentReport({
    agentName: '力量训练教练 Agent',
    riskLevel: highestRisk(risks),
    summary: weeklyStrengthSessions >= 2 ? '力量训练频率基本支持跑步表现。' : '力量训练频率需要补足。',
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
