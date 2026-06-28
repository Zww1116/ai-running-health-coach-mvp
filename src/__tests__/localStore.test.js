import { describe, expect, it } from 'vitest';
import { createStorageAdapter } from '../storage/localStore';

describe('local storage adapter', () => {
  it('loads fallback data when the storage key is empty', () => {
    const memory = new Map();
    const adapter = createStorageAdapter({
      storage: {
        getItem: (key) => memory.get(key) ?? null,
        setItem: (key, value) => memory.set(key, value),
      },
      key: 'test-records',
      fallback: [{ id: 'sample' }],
    });

    expect(adapter.load()).toEqual([{ id: 'sample' }]);
  });

  it('saves and reloads records as JSON', () => {
    const memory = new Map();
    const adapter = createStorageAdapter({
      storage: {
        getItem: (key) => memory.get(key) ?? null,
        setItem: (key, value) => memory.set(key, value),
      },
      key: 'test-records',
      fallback: [],
    });

    adapter.save([{ id: 'today', running: { km: 10 } }]);

    expect(adapter.load()).toEqual([{ id: 'today', running: { km: 10 } }]);
  });
});
