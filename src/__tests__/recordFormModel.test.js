import { describe, expect, it } from 'vitest';
import { buildRecordFromForm, defaultOpenRecordSections, recordSections } from '../components/recordFormModel';

describe('record form model', () => {
  it('defines five focused record sections with marathon running fields and pain note only', () => {
    expect(recordSections.map((section) => section.title)).toEqual([
      '跑步记录',
      '力量训练记录',
      '饮食记录',
      '睡眠记录',
      '经期记录',
    ]);
    expect(recordSections.find((section) => section.title === '跑步记录').fields).toEqual([
      'runningKm',
      'runningType',
      'runningDurationMin',
      'runningPace',
      'runningAvgHr',
      'runningCadence',
      'runningRpe',
      'runningNote',
      'painNote',
    ]);
    expect(recordSections.find((section) => section.title === '饮食记录').fields).toContain('weightKg');
  });

  it('defines the default open sections for a compact today record center', () => {
    expect(defaultOpenRecordSections).toEqual(['跑步记录', '饮食记录']);
  });

  it('builds the same daily record shape used by the coach analysis engine', () => {
    const record = buildRecordFromForm({
      date: '2026-06-28',
      runningKm: '9',
      runningType: 'easy',
      runningDurationMin: '52',
      runningPace: '5:47',
      runningAvgHr: '148',
      runningCadence: '176',
      runningRpe: '4',
      runningNote: 'aerobic run',
      painNote: 'warmup helped',
      strengthTrained: true,
      strengthFocus: '髋稳定',
      strengthMinutes: '40',
      calories: '2200',
      protein: '96',
      carbs: '260',
      hydration: '2.5',
      weightKg: '56.7',
      sleepHours: '7.8',
      sleepQuality: '4',
      cyclePhase: 'luteal',
      cycleDay: '15',
      cycleSymptoms: 'bloating, tired',
    });

    expect(record).toEqual({
      id: '2026-06-28',
      date: '2026-06-28',
      running: {
        km: 9,
        type: 'easy',
        durationMin: 52,
        pace: '5:47',
        avgHr: 148,
        cadence: 176,
        rpe: 4,
        note: 'aerobic run',
      },
      pain: { area: '备注', level: 0, note: 'warmup helped' },
      strength: { trained: true, focus: '髋稳定', minutes: 40 },
      nutrition: { calories: 2200, protein: 96, carbs: 260, hydration: 2.5 },
      body: { weightKg: 56.7 },
      sleep: { hours: 7.8, quality: 4 },
      cycle: { phase: 'luteal', day: 15, symptoms: ['bloating', 'tired'] },
    });
  });
});
