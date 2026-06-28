export function rehabAgent(data) {
  const findings = [];
  const recommendations = [];
  const warningFlags = [];
  const risks = ['low'];
  const pain = data.pain ?? {};
  const painValues = [pain.knee, pain.hip, pain.ankle, pain.lowerBack].map((value) => Number(value ?? 0));

  if (Number(pain.knee ?? 0) >= 4) {
    findings.push('膝痛达到 4/10 以上，当前伤病风险较高。');
    recommendations.push('停止速度训练和下坡跑，改为休息、低冲击交叉训练或轻松走动。');
    risks.push('high');
  } else if (Number(pain.knee ?? 0) >= 2) {
    findings.push('膝部已有早期疼痛信号。');
    recommendations.push('加强臀中肌、股四头肌、腘绳肌训练，并观察跑后 24 小时反应。');
    risks.push('medium');
  }

  if (Number(pain.hip ?? 0) >= 3) {
    findings.push('髋部疼痛达到 3/10 以上。');
    recommendations.push('减少跑量并加入髋稳定训练，例如蚌式、侧桥和单腿控制。');
    risks.push('medium');
  }

  if (Number(pain.ankle ?? 0) >= 3) {
    findings.push('足踝疼痛达到 3/10 以上。');
    recommendations.push('注意足踝灵活性、小腿力量和落地控制。');
    risks.push('medium');
  }

  if (Number(pain.lowerBack ?? 0) >= 3) {
    findings.push('下背疼痛达到 3/10 以上。');
    recommendations.push('加入核心稳定训练，避免疲劳状态下大重量硬拉或冲刺。');
    risks.push('medium');
  }

  if (Math.max(...painValues) >= 5) {
    warningFlags.push('任一疼痛达到 5/10 以上，建议寻求医生或物理治疗师评估。');
    risks.push('high');
  }

  if (findings.length === 0) {
    findings.push('疼痛评分整体可控。');
    recommendations.push('继续保持热身、跑后放松和下肢稳定练习。');
  }

  return createAgentReport({
    agentName: '康复防伤顾问 Agent',
    riskLevel: highestRisk(risks),
    summary: highestRisk(risks) === 'high' ? '疼痛风险需要优先处理。' : '疼痛与恢复风险可管理。',
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
