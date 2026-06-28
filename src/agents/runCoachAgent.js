export function runCoachAgent(data) {
  const findings = [];
  const recommendations = [];
  const warningFlags = [];
  const risks = ['low'];
  const run = data.run ?? {};
  const kneePain = Number(data.pain?.knee ?? 0);
  const avgHeartRate = Number(run.avgHeartRate ?? 0);
  const distanceKm = Number(run.distanceKm ?? 0);
  const sleepHours = Number(data.sleepHours ?? 0);
  const fatigueLevel = Number(data.fatigueLevel ?? 0);
  const intensity = run.intensity;

  if (distanceKm > 15 && sleepHours < 7) {
    findings.push('跑步距离超过 15km 且睡眠不足 7 小时，训练负荷和恢复压力叠加。');
    recommendations.push('今日或明日安排恢复跑、散步或完全休息，避免继续加量。');
    risks.push(fatigueLevel >= 7 || kneePain >= 3 ? 'high' : 'medium');
  }

  if (['interval', 'tempo'].includes(intensity) && fatigueLevel >= 7) {
    findings.push('高强度跑叠加疲劳感偏高，质量课收益可能下降。');
    recommendations.push('建议降低强度，把速度课改为低强度有氧或技术跑。');
    risks.push('medium');
  }

  if (avgHeartRate >= 165) {
    findings.push('平均心率偏高，可能提示恢复不足、天气压力或强度控制偏高。');
    recommendations.push('下一次跑步以心率和体感为主，优先控制在轻松区间。');
    risks.push('medium');
  }

  if (data.previousHighIntensityRun === true && ['interval', 'tempo'].includes(intensity)) {
    findings.push('存在连续高强度训练信号，恢复日不足会增加疲劳累积。');
    recommendations.push('两次质量课之间至少保留 48 小时低强度或休息。');
    risks.push('medium');
  }

  if (kneePain >= 3) {
    warningFlags.push('膝痛达到 3/10 以上，避免速度训练、冲刺和下坡跑。');
    recommendations.push('把跑后恢复重点放在臀中肌、股四头肌和小腿放松。');
    risks.push(kneePain >= 4 ? 'high' : 'medium');
  }

  if (findings.length === 0) {
    findings.push('今日跑步负荷和恢复信号整体可控。');
    recommendations.push('维持计划，同时继续记录心率、疲劳和疼痛变化。');
  }

  return createAgentReport({
    agentName: '跑步教练 Agent',
    riskLevel: highestRisk(risks),
    summary: highestRisk(risks) === 'low' ? '跑步训练可以维持当前计划。' : '跑步训练需要根据恢复和疼痛信号降载。',
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
