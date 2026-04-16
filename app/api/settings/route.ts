import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('settings')
    .select('key, value');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return as flat object { profile_photo: '...', cv_url: '...' }
  const obj: Record<string, string> = {};
  for (const row of data ?? []) obj[row.key] = row.value;
  return NextResponse.json(obj);
}

export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: 'key requis' }, { status: 400 });

    const { error } = await supabaseAdmin()
      .from('settings')
      .upsert({ key, value: value ?? '', updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
