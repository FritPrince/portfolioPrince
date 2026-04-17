import { createBrowserClient } from '@supabase/ssr';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client navigateur — uniquement dans les composants 'use client' */
export function createBrowserSupabase() {
  return createBrowserClient(URL, ANON);
}
