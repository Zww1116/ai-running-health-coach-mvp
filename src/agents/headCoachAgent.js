export function headCoachAgent(agentReports, data) {
  const rehab = findReport(agentReports, '康复防伤顾问 Agent');
  const nutrition = findReport(agentReports, '运动营养师 Agent');
  const femaleHealth = findReport(agentReports, '女性健康顾问 Agent');
  const runCoach = findReport(agentReports, '跑步教练 Agent');
  const keyRisks = agentReports.flatMap((report) => report.warningFlags.map((flag) => `${report.agentName}：${flag}`));
  let overallRiskLevel = highestRisk(agentReports.map((report) => report.riskLevel));

  if (rehab?.riskLevel === 'high') {
    overallRiskLevel = 'high';
  }

  const recoveryPoor = isPoorSleepRecovery(data);
  const runLoadHighAndSleepLow = (Number(data.run?.distanceKm ?? 0) > 15 && Number(data.sleepHours ?? 0) < 7) || recoveryPoor;
  const nutritionPriority = ['medium', 'high'].includes(nutrition?.riskLevel) || ['medium', 'high'].includes(femaleHealth?.riskLevel);

  return {
    overallRiskLevel,
    todayTrainingAdvice: buildTrainingAdvice({ overallRiskLevel, runLoadHighAndSleepLow, rehab, runCoach }),
    nutritionAdvice: nutritionPriority
      ? '今天优先补足能量、蛋白、碳水、健康脂肪与补铁食物，再追求训练质量。'
      : '营养支持基本可维持，训练前后继续保留碳水和蛋白。 ',
    recoveryAdvice: runLoadHighAndSleepLow
      ? '睡眠或恢复指标不足，建议安排恢复日，并把睡眠目标提高到 7.5 小时以上。'
      : '维持睡眠、放松和疼痛监控，避免连续叠加强度。',
    keyRisks,
    tomorrowAdjustment: buildTomorrowAdjustment(overallRiskLevel, nutritionPriority),
    weeklyFocus: [
      '维持月跑量约 200km 的节奏，但质量课之间保留恢复窗口。',
      '每周 2-3 次力量训练，重点保护肌肉量、跑步经济性和膝髋稳定。',
      '围绕雌激素、经期稳定和体脂不过度下降，补足蛋白、脂肪、铁和 Omega-3。',
      '疼痛超过 3/10 时先降强度，超过 5/10 时寻求专业评估。',
    ],
  };
}

function findReport(reports, agentName) {
  return reports.find((report) => report.agentName === agentName);
}

function highestRisk(levels) {
  if (levels.includes('high')) return 'high';
  if (levels.includes('medium')) return 'medium';
  return 'low';
}

function buildTrainingAdvice({ overallRiskLevel, runLoadHighAndSleepLow, rehab, runCoach }) {
  if (rehab?.riskLevel === 'high') {
    return '今日以恢复为主，停止速度训练、下坡跑和高冲击训练。';
  }
  if (runLoadHighAndSleepLow || runCoach?.riskLevel === 'high') {
    return '今日建议恢复日或 30-40 分钟低强度有氧，避免继续加量加速。';
  }
  if (overallRiskLevel === 'low') {
    return '所有风险较低，可以维持原计划，但继续监控疲劳、心率和疼痛。';
  }
  return '训练可以保留，但把强度降一级，并优先完成恢复和营养补给。';
}

function buildTomorrowAdjustment(overallRiskLevel, nutritionPriority) {
  if (overallRiskLevel === 'high') {
    return '明天先复查疼痛、睡眠和疲劳；若仍异常，继续休息或低冲击训练。';
  }
  if (nutritionPriority) {
    return '明天训练前确认主食和蛋白补足，再决定是否进行质量课。';
  }
  return '明天可按计划训练，保留热身、跑后放松和疼痛评分记录。';
}

function isPoorSleepRecovery(data) {
  const sleep = data.sleep ?? {};
  const sleepHours = Number(data.sleepHours ?? sleep.hours ?? 0);
  const quality = Number(sleep.quality ?? 0);
  const deepSleepHours = Number(sleep.deepHours ?? sleep.deepSleepHours ?? 0);
  const hrv = Number(sleep.hrv ?? 0);
  const wakeFatigue = Number(sleep.wakeFatigue ?? data.fatigueLevel ?? 0);

  return (
    sleepHours < 7 ||
    quality <= 2 ||
    (deepSleepHours > 0 && deepSleepHours < 1) ||
    (hrv > 0 && hrv < 35) ||
    wakeFatigue >= 7
  );
}
