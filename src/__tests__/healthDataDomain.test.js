import { describe, expect, it } from 'vitest';
import { buildDailyHealthDataFromRecord } from '../domain/healthData/dailyHealthData';
import { buildWeeklyHealthContext } from '../domain/healthData/weeklyHealthContext';

const records = [
  {
    id: '2026-07-01',
    date: '2026-07-01',
    running: { km: 8, type: 'easy', durationMin: 45, pace: '5:37', avgHr: 142, rpe: 4 },
    strength: { trained: true, focus: 'core', minutes: 35 },
    nutrition: { calories: 2100, protein: 90, carbs: 260, hydration: 2.2 },
    body: { weightKg: 50 },
    sleep: { hours: 7.5, deepHours: 1.3, lightHours: 4.4, remHours: 1.8, quality: 4, restingHr: 48, hrv: 58, wakeFatigue: 3 },
    cycle: { phase: 'follicular', day: 8, symptoms: [] },
    pain: { area: 'none', level: 0, note: '' },
  },
  {
    id: '2026-07-02',
    date: '2026-07-02',
    running: { km: 12, type: 'tempo', durationMin: 62, pace: '5:10', avgHr: 158, rpe: 7 },
    strength: { trained: false, focus: '', minutes: 0 },
    nutrition: { calories: 2300, protein: 98, carbs: 300, hydration: 2.5 },
    body: { weightKg: 50.1 },
    sleep: { hours: 6.5, deepHours: 0.8, lightHours: 4.4, remHours: 1.3, quality: 2, restingHr: 55, hrv: 34, wakeFatigue: 8 },
    cycle: { phase: 'follicular', day: 9, symptoms: [] },
    pain: { area: 'knee', level: 3, note: 'downhill sore' },
  },
];

describe('health data domain model', () => {
  it('maps a saved record into DailyHealthData for agents', () => {
    expect(buildDailyHealthDataFromRecord(records[1])).toMatchObject({
      date: '2026-07-02',
      bodyWeight: 50.1,
      sleepHours: 6.5,
      fatigueLevel: 8,
      menstrualPhase: 'follicular',
      run: {
        distanceKm: 12,
        durationMin: 62,
        avgPace: '5:10',
        avgHeartRate: 158,
        intensity: 'tempo',
      },
      pain: {
        knee: 3,
      },
    });
  });

  it('builds weekly health context without depending on UI forms', () => {
    expect(buildWeeklyHealthContext(records)).toMatchObject({
      dateRange: { from: '2026-07-01', to: '2026-07-02' },
      totalRunningKm: 20,
      strengthSessions: 1,
      averageSleepHours: 7,
      maxPainLevel: 3,
      latestDailyHealthData: {
        date: '2026-07-02',
        run: { intensity: 'tempo' },
      },
    });
  });
});
