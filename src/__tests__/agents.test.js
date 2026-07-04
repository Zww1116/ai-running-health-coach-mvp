import { describe, expect, it } from 'vitest';
import { analyzeHealthData } from '../agents/analyzeHealthData';
import { sampleAgentDailyHealthData } from '../data/sampleData';

describe('rule-based health agents', () => {
  it('returns structured reports for every specialist and a head coach plan', () => {
    const result = analyzeHealthData(sampleAgentDailyHealthData);

    expect(result.dailyHealthData.date).toBe('2026-06-28');
    expect(result.specialists.map((report) => report.agentName)).toEqual([
      '跑步教练 Agent',
      '力量训练教练 Agent',
      '运动营养师 Agent',
      '女性健康顾问 Agent',
      '康复防伤顾问 Agent',
    ]);

    for (const report of result.specialists) {
      expect(['low', 'medium', 'high']).toContain(report.riskLevel);
      expect(typeof report.summary).toBe('string');
      expect(Array.isArray(report.findings)).toBe(true);
      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(Array.isArray(report.warningFlags)).toBe(true);
    }

    expect(result.headCoach).toMatchObject({
      overallRiskLevel: expect.any(String),
      todayTrainingAdvice: expect.any(String),
      nutritionAdvice: expect.any(String),
      recoveryAdvice: expect.any(String),
      keyRisks: expect.any(Array),
      tomorrowAdjustment: expect.any(String),
      weeklyFocus: expect.any(Array),
    });
  });

  it('raises running and rehab risk when sleep is low and knee pain is notable', () => {
    const result = analyzeHealthData({
      ...sampleAgentDailyHealthData,
      sleepHours: 6.2,
      fatigueLevel: 8,
      run: {
        ...sampleAgentDailyHealthData.run,
        distanceKm: 18,
        intensity: 'tempo',
        avgHeartRate: 168,
      },
      pain: {
        ...sampleAgentDailyHealthData.pain,
        knee: 4,
      },
    });

    const runCoach = result.specialists.find((report) => report.agentName === '跑步教练 Agent');
    const rehab = result.specialists.find((report) => report.agentName === '康复防伤顾问 Agent');

    expect(runCoach.riskLevel).toBe('high');
    expect(runCoach.recommendations.join(' ')).toContain('降低强度');
    expect(runCoach.warningFlags.join(' ')).toContain('避免速度训练');
    expect(rehab.riskLevel).toBe('high');
    expect(result.headCoach.overallRiskLevel).toBe('high');
    expect(result.headCoach.todayTrainingAdvice).toContain('恢复');
  });

  it('prioritizes nutrition and female health when energy availability is low', () => {
    const result = analyzeHealthData({
      ...sampleAgentDailyHealthData,
      bodyWeight: 50,
      fatigueLevel: 8,
      nutrition: {
        ...sampleAgentDailyHealthData.nutrition,
        calories: 1650,
        proteinGram: 60,
        carbsGram: 160,
        fatGram: 32,
        ironRichFoods: false,
        omega3Foods: false,
        hydrationMl: 1500,
      },
    });

    const nutrition = result.specialists.find((report) => report.agentName === '运动营养师 Agent');
    const femaleHealth = result.specialists.find((report) => report.agentName === '女性健康顾问 Agent');

    expect(nutrition.riskLevel).toBe('high');
    expect(nutrition.findings.join(' ')).toContain('蛋白');
    expect(nutrition.recommendations.join(' ')).toContain('补铁');
    expect(femaleHealth.riskLevel).toBe('medium');
    expect(result.headCoach.nutritionAdvice).toContain('优先');
  });

  it('lowers daily training advice when sleep recovery metrics are poor', () => {
    const result = analyzeHealthData({
      ...sampleAgentDailyHealthData,
      sleepHours: 6.8,
      fatigueLevel: 7,
      sleep: {
        deepHours: 0.6,
        lightHours: 4.8,
        remHours: 1.1,
        quality: 2,
        restingHr: 58,
        hrv: 30,
        wakeFatigue: 8,
      },
      run: {
        ...sampleAgentDailyHealthData.run,
        distanceKm: 8,
        intensity: 'easy',
      },
      pain: {
        ...sampleAgentDailyHealthData.pain,
        knee: 0,
      },
    });

    const runCoach = result.specialists.find((report) => report.agentName === '跑步教练 Agent');

    expect(runCoach.riskLevel).toBe('medium');
    expect(runCoach.recommendations.join(' ')).toContain('恢复跑');
    expect(result.headCoach.todayTrainingAdvice).toContain('低强度');
    expect(result.headCoach.recoveryAdvice).toContain('睡眠');
  });
});
