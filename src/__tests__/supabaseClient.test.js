import { describe, expect, it } from 'vitest';
import { getSupabaseConfig } from '../integrations/supabaseClient';

describe('supabase client config', () => {
  it('is not configured when env values are missing', () => {
    expect(getSupabaseConfig({})).toEqual({
      status: 'not_configured',
      url: '',
      anonKey: '',
    });
  });

  it('is configured when url and anon key are present', () => {
    expect(
      getSupabaseConfig({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon-key',
      }),
    ).toEqual({
      status: 'configured',
      url: 'https://example.supabase.co',
      anonKey: 'anon-key',
    });
  });
});
