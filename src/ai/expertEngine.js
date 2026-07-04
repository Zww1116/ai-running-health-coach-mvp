const specialists = [
  {
    id: 'running',
    name: '跑步教练',
    role: '跑量、强度和配速结构',
    analyze: ({ profile, week, latest }) => {
      const targetWeekKm = profile.runningMonthlyKm / 4;
      const delta = week.runningKm - targetWeekKm;
      const poorSleepRecovery = isPoorSleepRecovery(latest.sleep);
      const advice =
        poorSleepRecovery
          ? '睡眠恢复不足，今天把跑步改为 20-40 分钟恢复跑或完全休息，取消速度训练和长距离加量。'
          : delta >= 4
          ? '本周跑量略高于目标，下一次跑步建议保持轻松配速，避免继续叠加强度。'
          : delta <= -4
            ? '本周跑量低于 200km/月节奏，可补一次 8-10km 轻松跑，但不追强度。'
            : '本周跑量贴近 200km/月节奏，保留一次质量课和一次长距离即可。';

      return {
        id: 'running',
        name: '跑步教练',
        role: '跑量、强度和配速结构',
        insight: `近 7 天跑量 ${week.runningKm}km，最近一次为 ${latest.running.type} ${latest.running.km}km。`,
        advice,
      };
    },
  },
  {
    id: 'strength',
    name: '力量训练教练',
    role: '力量频率、动作主题和跑力转换',
    analyze: ({ profile, week }) => {
      const remaining = profile.strengthSessionsPerWeek - week.strengthSessions;
      return {
        id: 'strength',
        name: '力量训练教练',
        role: '力量频率、动作主题和跑力转换',
        insight: `近 7 天力量训练 ${week.strengthSessions} 次，目标为 ${profile.strengthSessionsPerWeek} 次。`,
        advice:
          remaining > 0
            ? `还差 ${remaining} 次力量训练，优先安排髋稳定、单腿控制和核心抗旋。`
            : '力量频率达标，下一次训练降低总量，保留激活和灵活性。不能让力量训练影响关键跑课。',
      };
    },
  },
  {
    id: 'nutrition',
    name: '运动营养师',
    role: '能量、蛋白质、碳水和补水',
    analyze: ({ week }) => {
      const carbAdvice =
        week.runningKm >= 45
          ? '跑量较高，质量课和长距离前后要提高碳水占比，训练后 60 分钟内补蛋白和碳水。'
          : '维持均衡饮食即可，训练日前一餐不要刻意低碳。';
      return {
        id: 'nutrition',
        name: '运动营养师',
        role: '能量、蛋白质、碳水和补水',
        insight: `平均蛋白 ${week.averageProtein}g/天，平均饮水 ${week.averageHydration}L/天。`,
        advice: `${carbAdvice} 蛋白质建议稳定在 90-105g/天。`,
      };
    },
  },
  {
    id: 'female-health',
    name: '女性健康顾问',
    role: '经期、疲劳感和训练适配',
    analyze: ({ latest }) => {
      const isMenstruation = latest.cycle.phase === 'menstruation';
      return {
        id: 'female-health',
        name: '女性健康顾问',
        role: '经期、疲劳感和训练适配',
        insight: `当前记录为 ${latest.cycle.phase} 第 ${latest.cycle.day} 天，症状：${formatSymptoms(latest.cycle.symptoms)}。`,
        advice: isMenstruation
          ? '经期前 1-3 天以舒适度为先，出现腹痛或乏力时把强度课改为低强度有氧和拉伸。'
          : '当前可正常训练，但继续记录症状、体感和睡眠，观察周期与表现波动。',
      };
    },
  },
  {
    id: 'rehab',
    name: '康复防伤顾问',
    role: '疼痛趋势、恢复和伤病预防',
    analyze: ({ week, latest }) => {
      const hasPain = week.painMax >= 3 || latest.pain.level >= 3;
      return {
        id: 'rehab',
        name: '康复防伤顾问',
        role: '疼痛趋势、恢复和伤病预防',
        insight: `本周最高疼痛 ${week.painMax}/10，最新疼痛位置：${latest.pain.area}。`,
        advice: hasPain
          ? '疼痛达到需要管理的级别，未来 48 小时避免速度跑、下坡和大重量下肢训练，加入髋外展、足踝灵活性和局部放松。'
          : '疼痛信号可控，继续把热身、跑后放松和单腿稳定练习作为固定流程。',
      };
    },
  },
];

export function summarizeWeek(records) {
  const ordered = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const count = Math.max(ordered.length, 1);
  const latest = ordered[ordered.length - 1] ?? createEmptyRecord();

  return {
    runningKm: round(sum(ordered, (item) => item.running?.km ?? 0), 1),
    strengthSessions: ordered.filter((item) => item.strength?.trained).length,
    averageSleepHours: round(sum(ordered, (item) => item.sleep?.hours ?? 0) / count, 1),
    averageDeepSleepHours: round(sum(ordered, (item) => item.sleep?.deepHours ?? 0) / count, 1),
    averageHrv: Math.round(sum(ordered, (item) => item.sleep?.hrv ?? 0) / count),
    averageWakeFatigue: round(sum(ordered, (item) => item.sleep?.wakeFatigue ?? 0) / count, 1),
    averageProtein: Math.round(sum(ordered, (item) => item.nutrition?.protein ?? 0) / count),
    averageHydration: round(sum(ordered, (item) => item.nutrition?.hydration ?? 0) / count, 1),
    latestWeightKg: latest.body?.weightKg ?? null,
    painMax: Math.max(...ordered.map((item) => item.pain?.level ?? 0), 0),
    latest,
  };
}

export function generateCoachAnalysis(profile, records) {
  const week = summarizeWeek(records);
  const latest = week.latest;
  const riskLevel = getRiskLevel(week, latest);
  const context = { profile, records, week, latest, riskLevel };
  const specialistReports = specialists.map((specialist) => specialist.analyze(context));

  return {
    generatedAt: new Date().toISOString(),
    riskLevel,
    week,
    specialists: specialistReports,
    headCoach: buildHeadCoachReport({ week, latest, riskLevel, specialistReports }),
  };
}

export function createEmptyRecord() {
  return {
    id: '',
    date: '',
    running: { km: 0, type: 'rest', rpe: 1, note: '' },
    strength: { trained: false, focus: '', minutes: 0 },
    nutrition: { calories: 0, protein: 0, carbs: 0, hydration: 0 },
    body: { weightKg: null },
    sleep: {
      hours: 0,
      deepHours: 0,
      lightHours: 0,
      remHours: 0,
      quality: 0,
      restingHr: 0,
      hrv: 0,
      wakeFatigue: 0,
    },
    cycle: { phase: 'unknown', day: 1, symptoms: [] },
    pain: { area: 'none', level: 0, note: '' },
  };
}

function buildHeadCoachReport({ week, latest, riskLevel, specialistReports }) {
  const recoveryNeeded = riskLevel === 'high' || riskLevel === 'medium';
  const focus = recoveryNeeded ? '恢复优先，保留训练连续性' : '稳步推进跑量与力量质量';
  const dailyPlan = recoveryNeeded
    ? [
        '今日安排 30-45 分钟低强度有氧或完全休息，强度控制在 RPE 2-3。',
        '加入 12 分钟髋、膝、踝稳定练习，疼痛超过 4/10 立即停止。',
        '晚间优先睡眠，目标 7.5 小时以上。',
      ]
    : [
        '今日可完成 8-10km 轻松跑，结束后做 6 组 20 秒加速跑。',
        '力量训练选择核心、臀中肌和后链激活，总时长 35-45 分钟。',
        '训练后补充碳水和 25-30g 蛋白质。',
      ];

  return {
    id: 'head-coach',
    name: '总教练',
    focus,
    synthesis: specialistReports.map((report) => `${report.name}：${report.advice}`),
    dailyPlan,
    weeklyPlan: [
      `跑步：围绕 ${week.runningKm}km/周现状，安排 1 次质量课、1 次长距离、2-3 次轻松跑。`,
      `力量：维持 ${Math.max(0, 3 - week.strengthSessions)} 次待完成训练，优先跑者专项稳定性。`,
      `恢复：睡眠均值 ${week.averageSleepHours} 小时，疼痛最高 ${week.painMax}/10，按风险等级调整强度。`,
      `经期：当前 ${latest.cycle.phase} 阶段，把症状记录作为训练强度调节依据。`,
    ],
  };
}

function getRiskLevel(week, latest) {
  if (week.painMax >= 5 || latest.sleep.hours < 6 || latest.sleep?.wakeFatigue >= 9 || latest.cycle.phase === 'menstruation') {
    return 'high';
  }

  if (week.painMax >= 3 || week.averageSleepHours < 7 || isPoorSleepRecovery(latest.sleep)) {
    return 'medium';
  }

  return 'low';
}

function sum(items, selector) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function isPoorSleepRecovery(sleep = {}) {
  const hours = Number(sleep.hours ?? 0);
  const quality = Number(sleep.quality ?? 0);
  const deepHours = Number(sleep.deepHours ?? 0);
  const hrv = Number(sleep.hrv ?? 0);
  const wakeFatigue = Number(sleep.wakeFatigue ?? 0);

  return (
    hours < 7 ||
    quality <= 2 ||
    (deepHours > 0 && deepHours < 1) ||
    (hrv > 0 && hrv < 35) ||
    wakeFatigue >= 7
  );
}

function formatSymptoms(symptoms) {
  return symptoms?.length ? symptoms.join('、') : '无明显症状';
}
