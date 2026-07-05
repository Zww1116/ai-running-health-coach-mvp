const today = new Date().toISOString().slice(0, 10);

export const initialForm = {
  date: today,
  runningKm: 8,
  runningType: 'easy',
  runningDurationMin: 45,
  runningPace: '5:40',
  runningAvgHr: 145,
  runningCadence: 176,
  runningRpe: 4,
  runningNote: '',
  strengthTrained: false,
  strengthFocus: '核心和髋稳定',
  strengthMinutes: 35,
  calories: 2200,
  protein: 95,
  carbs: 260,
  hydration: 2.4,
  weightKg: 56.8,
  sleepHours: 7.5,
  deepSleepHours: 1.3,
  lightSleepHours: 4.4,
  remSleepHours: 1.8,
  sleepQuality: 4,
  restingHr: 48,
  hrv: 58,
  wakeFatigue: 3,
  cyclePhase: 'luteal',
  cycleDay: 14,
  cycleSymptoms: '',
  painNote: '',
  attachments: [],
};

export const recordSections = [
  {
    title: '跑步记录',
    fields: [
      'runningKm',
      'runningType',
      'runningDurationMin',
      'runningPace',
      'runningAvgHr',
      'runningCadence',
      'runningRpe',
      'runningNote',
      'painNote',
    ],
  },
  {
    title: '力量训练记录',
    fields: ['strengthTrained', 'strengthFocus', 'strengthMinutes'],
  },
  {
    title: '饮食记录',
    fields: ['calories', 'protein', 'carbs', 'hydration', 'weightKg'],
  },
  {
    title: '睡眠记录',
    fields: [
      'sleepHours',
      'deepSleepHours',
      'lightSleepHours',
      'remSleepHours',
      'sleepQuality',
      'restingHr',
      'hrv',
      'wakeFatigue',
    ],
  },
  {
    title: '经期记录',
    fields: ['cyclePhase', 'cycleDay', 'cycleSymptoms'],
  },
];

export const defaultOpenRecordSections = ['跑步记录', '饮食记录'];

export function buildRecordFromForm(form) {
  return {
    id: form.date,
    date: form.date,
    running: {
      km: Number(form.runningKm),
      type: form.runningType,
      durationMin: Number(form.runningDurationMin),
      pace: form.runningPace,
      avgHr: Number(form.runningAvgHr),
      cadence: Number(form.runningCadence),
      rpe: Number(form.runningRpe),
      note: form.runningNote,
    },
    pain: {
      area: form.painNote ? '备注' : 'none',
      level: 0,
      note: form.painNote,
    },
    strength: {
      trained: Boolean(form.strengthTrained),
      focus: form.strengthTrained ? form.strengthFocus : '',
      minutes: form.strengthTrained ? Number(form.strengthMinutes) : 0,
    },
    nutrition: {
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      hydration: Number(form.hydration),
    },
    body: { weightKg: Number(form.weightKg) },
    sleep: {
      hours: Number(form.sleepHours),
      deepHours: Number(form.deepSleepHours ?? 0),
      lightHours: Number(form.lightSleepHours ?? 0),
      remHours: Number(form.remSleepHours ?? 0),
      quality: Number(form.sleepQuality),
      restingHr: Number(form.restingHr ?? 0),
      hrv: Number(form.hrv ?? 0),
      wakeFatigue: Number(form.wakeFatigue ?? 0),
    },
    cycle: {
      phase: form.cyclePhase,
      day: Number(form.cycleDay),
      symptoms: form.cycleSymptoms
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    },
    attachments: Array.isArray(form.attachments) ? form.attachments : [],
  };
}

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
      fatGram: 0,
      ironRichFoods: false,
      omega3Foods: false,
      hydrationMl: Number(record.nutrition?.hydration ?? 0) * 1000,
    },
    pain: {
      knee: 0,
      hip: 0,
      ankle: 0,
      lowerBack: 0,
    },
  };
}

function normalizeAgentRunIntensity(type) {
  if (['tempo', 'interval', 'long'].includes(type)) return type;
  return 'easy';
}
