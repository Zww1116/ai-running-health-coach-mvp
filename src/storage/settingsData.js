const BACKUP_KEY = 'ai-running-health-local-backup';

export function createBackupPayload({ records, now = () => new Date() }) {
  return {
    schema: 'ai-health-backup-v1',
    exportedAt: now().toISOString(),
    records,
  };
}

export function parseRecordsImport(jsonText) {
  const parsed = JSON.parse(jsonText);
  const records = Array.isArray(parsed) ? parsed : parsed.records;

  if (!Array.isArray(records)) {
    throw new Error('导入文件里没有可用的 records 数组。');
  }

  return records;
}

export function createLocalBackupStore({ storage = window.localStorage, now = () => new Date() } = {}) {
  return {
    save(records) {
      const backup = createBackupPayload({ records, now });
      storage.setItem(BACKUP_KEY, JSON.stringify(backup));
      return backup;
    },

    load() {
      const raw = storage.getItem(BACKUP_KEY);
      if (!raw) return null;
      return createBackupPayload({
        records: parseRecordsImport(raw),
        now: () => new Date(JSON.parse(raw).exportedAt ?? now().toISOString()),
      });
    },

    clear() {
      storage.removeItem(BACKUP_KEY);
    },
  };
}

export async function getStorageEstimate(storageManager = navigator.storage) {
  if (!storageManager?.estimate) {
    return {
      supported: false,
      usage: 0,
      quota: 0,
      usageLabel: '不可用',
      quotaLabel: '不可用',
      percent: 0,
    };
  }

  const estimate = await storageManager.estimate();
  const usage = estimate.usage ?? 0;
  const quota = estimate.quota ?? 0;

  return {
    supported: true,
    usage,
    quota,
    usageLabel: formatBytes(usage),
    quotaLabel: formatBytes(quota),
    percent: quota > 0 ? Math.round((usage / quota) * 100) : 0,
  };
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${Number(value.toFixed(1))} ${units[unitIndex]}`;
}
