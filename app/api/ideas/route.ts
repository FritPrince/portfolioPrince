import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(i: any) {
  return {
    id:          i.id,
    title:       i.title,
    description: i.description,
    image:       i.image ?? '',
    pdfUrl:      i.pdf_url ?? '',
    category:    i.category ?? '',
    createdAt:   i.created_at,
  };
}

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(normalize));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, pdfUrl, category } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Titre et description requis' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('ideas')
      .insert({ title, description, image: image ?? '', pdf_url: pdfUrl ?? '', category: category ?? '' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Idée créée', idea: normalize(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
