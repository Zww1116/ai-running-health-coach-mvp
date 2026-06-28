const latestRunningActivity = {
  distanceKm: 16.2,
  workoutType: 'marathon-pace',
  durationMin: 82,
  averagePace: '5:04',
  averageHeartRate: 152,
  cadence: 178,
  perceivedEffort: 6,
  title: '上次马拉松配速跑',
};

const latestStrengthActivity = {
  focus: '跑者下肢力量 + 核心',
  durationMin: 46,
};

export async function syncLatestCorosRunning() {
  return {
    source: 'COROS',
    patch: {
      runningKm: latestRunningActivity.distanceKm,
      runningType: latestRunningActivity.workoutType,
      runningDurationMin: latestRunningActivity.durationMin,
      runningPace: latestRunningActivity.averagePace,
      runningAvgHr: latestRunningActivity.averageHeartRate,
      runningCadence: latestRunningActivity.cadence,
      runningRpe: latestRunningActivity.perceivedEffort,
      runningNote: `COROS 同步：${latestRunningActivity.title}`,
    },
  };
}

export async function syncLatestCorosStrength() {
  return {
    source: 'COROS',
    patch: {
      strengthTrained: true,
      strengthFocus: latestStrengthActivity.focus,
      strengthMinutes: latestStrengthActivity.durationMin,
    },
  };
}
