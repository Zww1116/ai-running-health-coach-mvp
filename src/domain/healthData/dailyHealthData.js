export function buildDailyHealthDataFromRecord(record) {
  return {
    date: record.date,
    bodyWeight: Number(record.body?.weightKg ?? 0),
    sleepHours: Number(record.sleep?.hours ?? 0),
    fatigueLevel: Number(record.sleep?.wakeFatigue ?? record.running?.rpe ?? 0),
    menstrualPhase: record.cycle?.phase ?? '',
    sleep: {
      deepHours: Number(record.sleep?.deepHours ?? 0),
      lightHours: Number(record.sleep?.lightHours ?? 0),
      remHours: Number(record.sleep?.remHours ?? 0),
      quality: Number(record.sleep?.quality ?? 0),
      restingHr: Number(record.sleep?.restingHr ?? 0),
      hrv: Number(record.sleep?.hrv ?? 0),
      wakeFatigue: Number(record.sleep?.wakeFatigue ?? 0),
    },
    run: {
      distanceKm: Number(record.running?.km ?? 0),
      durationMin: Number(record.running?.durationMin ?? 0),
      avgPace: record.running?.pace ?? '',
      avgHeartRate: Number(record.running?.avgHr ?? 0),
      intensity: normalizeAgentRunIntensity(record.running?.type),
    },
    strength: {
      trained: Boolean(record.strength?.trained),
      bodyPart: record.strength?.focus ?? '',
      durationMin: Number(record.strength?.minutes ?? 0),
      intensity: 'medium',
    },
    nutrition: {
      calories: Number(record.nutrition?.calories ?? 0),
      proteinGram: Number(record.nutrition?.protein ?? 0),
      carbsGram: Number(record.nutrition?.carbs ?? 0),
      fatGram: Number(record.nutrition?.fat ?? 0),
      ironRichFoods: Boolean(record.nutrition?.ironRichFoods),
      omega3Foods: Boolean(record.nutrition?.omega3Foods),
      hydrationMl: Number(record.nutrition?.hydration ?? 0) * 1000,
    },
    pain: mapPainToBodyRegions(record.pain),
  };
}

export function mapPainToBodyRegions(pain = {}) {
  const level = Number(pain.level ?? 0);
  const text = `${pain.area ?? ''} ${pain.note ?? ''}`.toLowerCase();

  return {
    knee: includesAny(text, ['knee', '膝']) ? level : 0,
    hip: includesAny(text, ['hip', '髋']) ? level : 0,
    ankle: includesAny(text, ['ankle', '踝']) ? level : 0,
    lowerBack: includesAny(text, ['back', 'lowerback', '腰']) ? level : 0,
  };
}

function normalizeAgentRunIntensity(type) {
  if (['tempo', 'interval', 'long'].includes(type)) return type;
  return 'easy';
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}
