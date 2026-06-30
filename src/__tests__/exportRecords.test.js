import { describe, expect, it } from 'vitest';
import { createRecordsExport } from '../storage/exportRecords';

describe('records export', () => {
  it('creates a stable json export payload', () => {
    expect(
      createRecordsExport({
        records: [{ id: 'today', date: '2026-06-30' }],
        now: () => new Date('2026-06-30T12:34:56.000Z'),
      }),
    ).toEqual({
      filename: 'ai-health-records-2026-06-30.json',
      json: JSON.stringify(
        {
          exportedAt: '2026-06-30T12:34:56.000Z',
          records: [{ id: 'today', date: '2026-06-30' }],
        },
        null,
        2,
      ),
    });
  });
});
