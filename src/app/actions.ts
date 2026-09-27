'use server';

import { createClient } from '@supabase/supabase-js';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function pingSupabase(): Promise<{ ok: boolean; message: string }> {
  const client = getServerSupabase();
  if (!client) {
    return { ok: false, message: 'Supabase env not configured' };
  }
  const { error } = await client.from('app_settings').select('id').eq('id', 1).maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Connected' };
}
