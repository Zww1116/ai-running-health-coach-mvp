import { describe, expect, it } from 'vitest';
import { createRecordRepository } from '../storage/recordRepository';

function createFakeLocalStore(initialRecords = []) {
  let records = initialRecords;
  let cleared = false;
  return {
    load: () => records,
    save: (nextRecords) => {
      records = nextRecords;
    },
    clear: () => {
      cleared = true;
      records = [];
    },
    state: () => ({ records, cleared }),
  };
}

describe('record repository', () => {
  it('uses local storage when there is no session', async () => {
    const localStore = createFakeLocalStore([{ id: 'local' }]);
    const repository = createRecordRepository({
      localStore,
      cloudStore: null,
      getSession: async () => null,
    });

    await expect(repository.load()).resolves.toEqual({
      records: [{ id: 'local' }],
      mode: 'local',
      message: '当前为本机记录模式。',
    });
  });

  it('loads cloud records and mirrors them to local storage when signed in', async () => {
    const localStore = createFakeLocalStore([{ id: 'local' }]);
    const cloudStore = {
      load: async () => [{ id: 'cloud' }],
      save: async () => {},
      deleteAll: async () => {},
    };
    const repository = createRecordRepository({
      localStore,
      cloudStore,
      getSession: async () => ({ user: { id: 'user-1' } }),
    });

    await expect(repository.load()).resolves.toEqual({
      records: [{ id: 'cloud' }],
      mode: 'cloud',
      message: '已从云端同步记录。',
    });
    expect(localStore.state().records).toEqual([{ id: 'cloud' }]);
  });

  it('saves locally and to cloud when signed in', async () => {
    const localStore = createFakeLocalStore();
    const savedToCloud = [];
    const cloudStore = {
      load: async () => [],
      save: async (records) => savedToCloud.push(records),
      deleteAll: async () => {},
    };
    const repository = createRecordRepository({
      localStore,
      cloudStore,
      getSession: async () => ({ user: { id: 'user-1' } }),
    });
    const records = [{ id: 'today' }];

    await expect(repository.save(records)).resolves.toEqual({
      mode: 'cloud',
      message: '已保存到本机并同步到云端。',
    });
    expect(localStore.state().records).toEqual(records);
    expect(savedToCloud).toEqual([records]);
  });

  it('clears local records through the local adapter', () => {
    const localStore = createFakeLocalStore([{ id: 'local' }]);
    const repository = createRecordRepository({
      localStore,
      cloudStore: null,
      getSession: async () => null,
    });

    repository.clearLocal();

    expect(localStore.state()).toEqual({ records: [], cleared: true });
  });
});
