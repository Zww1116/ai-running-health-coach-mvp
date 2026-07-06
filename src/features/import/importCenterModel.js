import { buildRecordFromForm, initialForm } from '../../components/recordFormModel';

export function buildImportDraft(importResult) {
  return {
    source: importResult.source,
    activityType: importResult.activityType ?? 'running',
    form: {
      ...initialForm,
      ...importResult.patch,
      attachments: [],
    },
  };
}

export function buildRecordFromImportDraft(draft) {
  return buildRecordFromForm(draft.form);
}
