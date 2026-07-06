import { describe, expect, it } from 'vitest';
import { buildImportDraft, buildRecordFromImportDraft } from '../features/import/importCenterModel';

describe('import center model', () => {
  it('builds an editable draft from a COROS running import result', () => {
    const draft = buildImportDraft({
      source: 'COROS GPX',
      activityType: 'running',
      patch: {
        date: '2026-07-03',
        runningKm: 12.4,
        runningType: 'tempo',
        runningDurationMin: 64,
        runningPace: '5:10',
        runningAvgHr: 158,
        runningCadence: 178,
        runningRpe: 7,
        runningNote: 'COROS GPX import',
      },
    });

    expect(draft).toMatchObject({
      source: 'COROS GPX',
      activityType: 'running',
      form: {
        date: '2026-07-03',
        runningKm: 12.4,
        runningType: 'tempo',
        runningDurationMin: 64,
        runningPace: '5:10',
        runningAvgHr: 158,
        runningCadence: 178,
        runningRpe: 7,
      },
    });
  });

  it('saves the reviewed import draft as a normal health record with attachments', () => {
    const draft = buildImportDraft({
      source: 'manual import',
      activityType: 'running',
      patch: {
        date: '2026-07-04',
        runningKm: 8,
        runningDurationMin: 45,
      },
    });

    const record = buildRecordFromImportDraft({
      ...draft,
      form: {
        ...draft.form,
        attachments: [{ id: 'local-image-1', type: 'coros', name: 'run.png' }],
      },
    });

    expect(record).toMatchObject({
      id: '2026-07-04',
      date: '2026-07-04',
      running: { km: 8, durationMin: 45 },
      attachments: [{ id: 'local-image-1', type: 'coros', name: 'run.png' }],
    });
  });
});
