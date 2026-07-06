import { describe, expect, it } from 'vitest';
import { buildLiveAgentAnalysis } from '../features/analysis/liveAgentAnalysis';

const records = [
  {
    id: '2026-07-02',
    date: '2026-07-02',
    running: { km: 8, type: 'easy', durationMin: 45, pace: '5:37', avgHr: 142, rpe: 4 },
    strength: { trained: true, focus: 'core', minutes: 35 },
    nutrition: { calories: 2100, protein: 90, carbs: 260, hydration: 2.2 },
    body: { weightKg: 50 },
    sleep: { hours: 7.5, deepHours: 1.3, lightHours: 4.4, remHours: 1.8, quality: 4, restingHr: 48, hrv: 58, wakeFatigue: 3 },
    cycle: { phase: 'follicular', day: 8, symptoms: [] },
    pain: { area: 'none', level: 0, note: '' },
  },
  {
    id: '2026-07-03',
    date: '2026-07-03',
    running: { km: 16, type: 'long', durationMin: 88, pace: '5:30', avgHr: 162, rpe: 7 },
    strength: { trained: false, focus: '', minutes: 0 },
    nutrition: { calories: 2000, protein: 75, carbs: 210, hydration: 1.6 },
    body: { weightKg: 50.2 },
    sleep: { hours: 6.4, deepHours: 0.7, lightHours: 4.5, remHours: 1.2, quality: 2, restingHr: 58, hrv: 32, wakeFatigue: 8 },
    cycle: { phase: 'luteal', day: 21, symptoms: [] },
    pain: { area: 'left knee', level: 4, note: 'downhill sore' },
  },
];

describe('live rule-agent analysis', () => {
  it('uses the latest saved record as dailyHealthData for agents', () => {
    const result = buildLiveAgentAnalysis(records, {
      goal: '稳定月跑量 200km',
      runningMonthlyKm: 200,
      strengthSessionsPerWeek: 3,
      heightCm: 157,
    });

    expect(result.source).toBe('latest-record');
    expect(result.dailyHealthData).toMatchObject({
      date: '2026-07-03',
      heightCm: 157,
      monthlyRunningKm: 200,
      weeklyStrengthSessions: 1,
      goal: '稳定月跑量 200km',
      run: { distanceKm: 16, intensity: 'long' },
      pain: { knee: 4 },
    });
    expect(result.analysis.headCoach.overallRiskLevel).toBe('high');
  });

  it('falls back to sample data when no records exist', () => {
    const result = buildLiveAgentAnalysis([], { goal: 'custom goal' });

    expect(result.source).toBe('sample');
    expect(result.dailyHealthData.date).toBe('2026-06-28');
  });
});
