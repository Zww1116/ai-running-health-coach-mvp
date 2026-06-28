export async function syncHealthRecords() {
  return {
    provider: 'Supabase/PostgreSQL',
    status: 'not_configured',
    message: '当前 MVP 使用 localStorage；配置 Supabase 后可迁移到云端账号和数据库。',
  };
}
