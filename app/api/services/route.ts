import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(s: any) {
  return {
    id:            s.id,
    icon:          s.icon           ?? '',
    title:         s.title,
    titleEn:       s.title_en       ?? '',
    description:   s.description,
    descriptionEn: s.description_en ?? '',
    technologies:  s.technologies   ?? [],
    sortOrder:     s.sort_order     ?? 0,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(normalize));
}

export async function POST(request: NextRequest) {
  try {
    const b = await request.json();
    const { data, error } = await supabaseAdmin()
      .from('services')
      .insert({
        icon:           b.icon           ?? '',
        title:          b.title,
        title_en:       b.titleEn        ?? '',
        description:    b.description,
        description_en: b.descriptionEn  ?? '',
        technologies:   Array.isArray(b.technologies) ? b.technologies : [],
        sort_order:     b.sortOrder      ?? 0,
      })
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(normalize(data), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
