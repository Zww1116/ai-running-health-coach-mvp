const today = new Date().toISOString().slice(0, 10);

export { buildDailyHealthDataFromRecord } from '../domain/healthData/dailyHealthData';

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
