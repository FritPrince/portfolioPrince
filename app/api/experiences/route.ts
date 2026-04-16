import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(e: any) {
  return {
    id:            e.id,
    company:       e.company,
    role:          e.role,
    roleEn:        e.role_en        ?? '',
    period:        e.period,
    location:      e.location       ?? '',
    description:   e.description,
    descriptionEn: e.description_en ?? '',
    technologies:  e.technologies   ?? [],
    current:       e.current        ?? false,
    type:          e.type           ?? 'work',
    sortOrder:     e.sort_order     ?? 0,
    logoUrl:       e.logo_url       ?? '',
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(normalize));
}

export async function POST(request: NextRequest) {
  try {
    const b = await request.json();
    const { data, error } = await supabaseAdmin()
      .from('experiences')
      .insert({
        company:        b.company,
        role:           b.role,
        role_en:        b.roleEn        ?? '',
        period:         b.period,
        location:       b.location      ?? '',
        description:    b.description,
        description_en: b.descriptionEn ?? '',
        technologies:   Array.isArray(b.technologies) ? b.technologies : [],
        current:        b.current       ?? false,
        type:           b.type          ?? 'work',
        sort_order:     b.sortOrder     ?? 0,
        logo_url:       b.logoUrl       ?? '',
      })
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(normalize(data), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
