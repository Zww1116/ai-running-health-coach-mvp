import { buildDailyHealthDataFromRecord } from './dailyHealthData';

export function buildWeeklyHealthContext(records) {
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const latestRecord = sortedRecords.at(-1);

  return {
    dateRange: {
      from: sortedRecords[0]?.date ?? '',
      to: latestRecord?.date ?? '',
    },
    totalRunningKm: roundOne(sum(sortedRecords, (record) => Number(record.running?.km ?? 0))),
    strengthSessions: sortedRecords.filter((record) => record.strength?.trained).length,
    averageSleepHours: roundOne(average(sortedRecords, (record) => Number(record.sleep?.hours ?? 0))),
    maxPainLevel: Math.max(0, ...sortedRecords.map((record) => Number(record.pain?.level ?? 0))),
    latestDailyHealthData: latestRecord ? buildDailyHealthDataFromRecord(latestRecord) : null,
  };
}

function sum(items, selector) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function average(items, selector) {
  if (items.length === 0) return 0;
  return sum(items, selector) / items.length;
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}
