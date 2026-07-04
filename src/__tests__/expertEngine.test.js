import { describe, expect, it } from 'vitest';
import { sampleRecords, sampleProfile } from '../data/sampleData';
import { generateCoachAnalysis, summarizeWeek } from '../ai/expertEngine';

describe('expert engine', () => {
  it('returns independent reports for every specialist plus the head coach plan', () => {
    const analysis = generateCoachAnalysis(sampleProfile, sampleRecords);

    expect(analysis.specialists.map((item) => item.id)).toEqual([
      'running',
      'strength',
      'nutrition',
      'female-health',
      'rehab',
    ]);
    expect(analysis.headCoach.id).toBe('head-coach');
    expect(analysis.headCoach.dailyPlan.length).toBeGreaterThan(0);
    expect(analysis.headCoach.weeklyPlan.length).toBeGreaterThan(0);
  });

  it('reduces intensity when pain, poor sleep, or menstruation signals are present', () => {
    const highRiskRecords = [
      {
        ...sampleRecords[0],
        sleep: { hours: 5, quality: 2 },
        cycle: { phase: 'menstruation', day: 2, symptoms: ['cramps'] },
        pain: { area: 'left knee', level: 6, note: 'stairs hurt' },
      },
    ];

    const analysis = generateCoachAnalysis(sampleProfile, highRiskRecords);

    expect(analysis.riskLevel).toBe('high');
    expect(analysis.headCoach.focus).toContain('恢复');
    expect(analysis.headCoach.dailyPlan.join(' ')).toContain('低强度');
  });

  it('summarizes weekly running, strength, nutrition, and recovery signals', () => {
    const summary = summarizeWeek(sampleRecords);

    expect(summary.runningKm).toBe(50);
    expect(summary.strengthSessions).toBe(3);
    expect(summary.averageSleepHours).toBeGreaterThan(7);
    expect(summary.latestWeightKg).toBe(56.8);
    expect(summary.painMax).toBe(3);
  });

  it('lowers running and head coach advice when sleep recovery is poor', () => {
    const poorRecoveryRecords = [
      {
        ...sampleRecords[0],
        sleep: {
          hours: 6.4,
          deepHours: 0.7,
          lightHours: 4.7,
          remHours: 1,
          quality: 2,
          restingHr: 58,
          hrv: 32,
          wakeFatigue: 8,
        },
        pain: { area: 'none', level: 0, note: '' },
        cycle: { phase: 'follicular', day: 8, symptoms: [] },
      },
    ];

    const analysis = generateCoachAnalysis(sampleProfile, poorRecoveryRecords);
    const running = analysis.specialists.find((item) => item.id === 'running');

    expect(analysis.riskLevel).toBe('medium');
    expect(running.advice).toContain('恢复跑');
    expect(analysis.headCoach.dailyPlan.join(' ')).toContain('低强度');
  });
});
