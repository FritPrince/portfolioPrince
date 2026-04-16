import { createClient, SupabaseClient } from '@supabase/supabase-js';

/* ── Lazy singletons — not evaluated at module load time ──────── */
let _client: SupabaseClient | null = null;
let _admin:  SupabaseClient | null = null;

/** Client côté navigateur (anon key) */
export function getSupabase() {
  if (!_client) {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) throw new Error('Missing Supabase env vars (URL / ANON_KEY)');
    _client = createClient(url, anon);
  }
  return _client;
}

/** Client serveur avec service role — uniquement dans les API routes */
export function supabaseAdmin() {
  if (!_admin) {
    const url        = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error('Missing Supabase env vars (URL / SERVICE_ROLE_KEY)');
    _admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}
