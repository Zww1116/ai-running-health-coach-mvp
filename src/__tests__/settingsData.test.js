import { describe, expect, it } from 'vitest';
import {
  createBackupPayload,
  createLocalBackupStore,
  formatBytes,
  getStorageEstimate,
  parseRecordsImport,
} from '../storage/settingsData';

describe('settings data management', () => {
  it('creates a versioned local backup payload', () => {
    const backup = createBackupPayload({
      records: [{ id: '2026-07-04', date: '2026-07-04' }],
      now: () => new Date('2026-07-04T08:00:00.000Z'),
    });

    expect(backup).toEqual({
      schema: 'ai-health-backup-v1',
      exportedAt: '2026-07-04T08:00:00.000Z',
      records: [{ id: '2026-07-04', date: '2026-07-04' }],
    });
  });

  it('parses both full backup files and old record export files', () => {
    expect(
      parseRecordsImport(
        JSON.stringify({
          schema: 'ai-health-backup-v1',
          exportedAt: '2026-07-04T08:00:00.000Z',
          records: [{ id: 'backup' }],
        }),
      ),
    ).toEqual([{ id: 'backup' }]);

    expect(
      parseRecordsImport(
        JSON.stringify({
          exportedAt: '2026-07-04T08:00:00.000Z',
          records: [{ id: 'old-export' }],
        }),
      ),
    ).toEqual([{ id: 'old-export' }]);
  });

  it('stores and restores a local browser backup', () => {
    const memory = new Map();
    const store = createLocalBackupStore({
      storage: {
        getItem: (key) => memory.get(key) ?? null,
        setItem: (key, value) => memory.set(key, value),
        removeItem: (key) => memory.delete(key),
      },
      now: () => new Date('2026-07-04T08:00:00.000Z'),
    });

    store.save([{ id: 'today' }]);

    expect(store.load()).toEqual({
      schema: 'ai-health-backup-v1',
      exportedAt: '2026-07-04T08:00:00.000Z',
      records: [{ id: 'today' }],
    });
  });

  it('formats storage bytes for display', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  it('returns unavailable storage estimate when browser API is missing', async () => {
    await expect(getStorageEstimate(null)).resolves.toEqual({
      supported: false,
      usage: 0,
      quota: 0,
      usageLabel: '不可用',
      quotaLabel: '不可用',
      percent: 0,
    });
  });
});
