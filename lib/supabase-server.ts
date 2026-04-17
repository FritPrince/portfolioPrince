import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client serveur — uniquement dans les Server Components et Route Handlers */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cookieStore as any).set(name, value, options);
          });
        } catch {
          // Read-only context — middleware handles refresh separately
        }
      },
    },
  });
}
