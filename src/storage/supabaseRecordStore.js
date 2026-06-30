const TABLE = 'health_records';

async function requireUser(getUser) {
  const user = await getUser();
  if (!user?.id) {
    throw new Error('需要登录后才能同步云端记录。');
  }
  return user;
}

export function createSupabaseRecordStore({ client, getUser }) {
  return {
    async load() {
      const user = await requireUser(getUser);
      const { data, error } = await client
        .from(TABLE)
        .select('id, record, record_date, updated_at')
        .eq('user_id', user.id)
        .order('record_date', { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => row.record);
    },

    async save(records) {
      const user = await requireUser(getUser);
      const rows = records.map((record) => ({
        id: record.id,
        user_id: user.id,
        record_date: record.date,
        record,
      }));

      const { error } = await client.from(TABLE).upsert(rows, { onConflict: 'user_id,id' });
      if (error) throw new Error(error.message);
    },

    async deleteAll() {
      const user = await requireUser(getUser);
      const { error } = await client.from(TABLE).delete().eq('user_id', user.id);
      if (error) throw new Error(error.message);
    },
  };
}
