const DEFAULT_KEY = 'ai-running-health-records';

export function createStorageAdapter({ storage, key = DEFAULT_KEY, fallback = [] }) {
  return {
    load() {
      const raw = storage.getItem(key);
      if (!raw) return fallback;

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    save(records) {
      storage.setItem(key, JSON.stringify(records));
    },
    clear() {
      storage.setItem(key, JSON.stringify([]));
    },
  };
}

export function createBrowserStorageAdapter(fallback) {
  return createStorageAdapter({
    storage: window.localStorage,
    key: DEFAULT_KEY,
    fallback,
  });
}
