import { describe, expect, it } from 'vitest';
import { createSupabaseRecordStore } from '../storage/supabaseRecordStore';

function createFakeClient({ selectRows = [], error = null } = {}) {
  const calls = [];
  const query = {
    select: (columns) => {
      calls.push(['select', columns]);
      return query;
    },
    eq: (column, value) => {
      calls.push(['eq', column, value]);
      return query;
    },
    order: (column, options) => {
      calls.push(['order', column, options]);
      return Promise.resolve({ data: selectRows, error });
    },
    upsert: (rows, options) => {
      calls.push(['upsert', rows, options]);
      return Promise.resolve({ error });
    },
    delete: () => {
      calls.push(['delete']);
      return query;
    },
  };

  return {
    calls,
    from: (table) => {
      calls.push(['from', table]);
      return query;
    },
  };
}

describe('supabase record store', () => {
  it('loads only records for the signed-in user', async () => {
    const client = createFakeClient({
      selectRows: [{ id: '2026-06-30', record: { id: '2026-06-30', date: '2026-06-30' } }],
    });
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => ({ id: 'user-1' }),
    });

    await expect(store.load()).resolves.toEqual([{ id: '2026-06-30', date: '2026-06-30' }]);
    expect(client.calls).toContainEqual(['eq', 'user_id', 'user-1']);
  });

  it('upserts records with the signed-in user id', async () => {
    const client = createFakeClient();
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => ({ id: 'user-1' }),
    });

    await store.save([{ id: 'today', date: '2026-06-30' }]);

    expect(client.calls).toContainEqual([
      'upsert',
      [
        {
          id: 'today',
          user_id: 'user-1',
          record_date: '2026-06-30',
          record: { id: 'today', date: '2026-06-30' },
        },
      ],
      { onConflict: 'user_id,id' },
    ]);
  });

  it('deletes only records for the signed-in user', async () => {
    const client = createFakeClient();
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => ({ id: 'user-1' }),
    });

    await store.deleteAll();

    expect(client.calls).toContainEqual(['delete']);
    expect(client.calls).toContainEqual(['eq', 'user_id', 'user-1']);
  });

  it('rejects cloud operations without a signed-in user', async () => {
    const client = createFakeClient();
    const store = createSupabaseRecordStore({
      client,
      getUser: async () => null,
    });

    await expect(store.load()).rejects.toThrow('需要登录后才能同步云端记录。');
  });
});
