import { analyzeHealthData } from '../../agents/analyzeHealthData';
import { sampleAgentDailyHealthData } from '../../data/sampleData';
import { buildDailyHealthDataFromRecord } from '../../domain/healthData/dailyHealthData';
import { buildWeeklyHealthContext } from '../../domain/healthData/weeklyHealthContext';

export function buildLiveAgentAnalysis(records, profile = {}) {
  if (!records.length) {
    const dailyHealthData = {
      ...sampleAgentDailyHealthData,
      goal: profile.goal ?? sampleAgentDailyHealthData.goal,
    };
    return {
      source: 'sample',
      dailyHealthData,
      analysis: analyzeHealthData(dailyHealthData),
    };
  }

  const weeklyContext = buildWeeklyHealthContext(records);
  const dailyHealthData = {
    ...weeklyContext.latestDailyHealthData,
    heightCm: Number(profile.heightCm ?? 157),
    monthlyRunningKm: Number(profile.runningMonthlyKm ?? 0),
    weeklyStrengthSessions: weeklyContext.strengthSessions,
    goal: profile.goal ?? '',
  };

  return {
    source: 'latest-record',
    dailyHealthData,
    analysis: analyzeHealthData(dailyHealthData),
  };
}

export function buildDailyHealthDataForAnalysis(record, profile = {}, records = []) {
  const weeklyContext = buildWeeklyHealthContext(records.length ? records : [record]);
  return {
    ...buildDailyHealthDataFromRecord(record),
    heightCm: Number(profile.heightCm ?? 157),
    monthlyRunningKm: Number(profile.runningMonthlyKm ?? 0),
    weeklyStrengthSessions: weeklyContext.strengthSessions,
    goal: profile.goal ?? '',
  };
}
