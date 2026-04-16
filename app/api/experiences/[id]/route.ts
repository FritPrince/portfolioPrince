import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const b = await request.json();
    const { data, error } = await supabaseAdmin()
      .from('experiences')
      .update({
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
      .eq('id', params.id)
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin().from('experiences').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
