import { createClient } from '@supabase/supabase-js';

export function getSupabaseConfig(env = import.meta.env) {
  const url = env.VITE_SUPABASE_URL || '';
  const anonKey = env.VITE_SUPABASE_ANON_KEY || '';

  return {
    status: url && anonKey ? 'configured' : 'not_configured',
    url,
    anonKey,
  };
}

export function createOptionalSupabaseClient(env = import.meta.env) {
  const config = getSupabaseConfig(env);
  if (config.status !== 'configured') {
    return {
      client: null,
      status: 'not_configured',
      message: 'Supabase is not configured. Records are stored in this browser.',
    };
  }

  return {
    client: createClient(config.url, config.anonKey),
    status: 'configured',
    message: 'Supabase is configured. Sign in to sync cloud records.',
  };
}

export async function syncHealthRecords(env = import.meta.env) {
  const config = getSupabaseConfig(env);
  return {
    provider: 'Supabase/PostgreSQL',
    status: config.status,
    message:
      config.status === 'configured'
        ? 'Supabase is configured. Sign in to sync cloud records.'
        : 'Supabase is not configured. Records are stored in localStorage.',
  };
}
