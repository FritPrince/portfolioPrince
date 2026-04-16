import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(i: any) {
  return {
    id: i.id, title: i.title, description: i.description,
    image: i.image ?? '', pdfUrl: i.pdf_url ?? '',
    category: i.category ?? '', createdAt: i.created_at,
  };
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data, error } = await db.from('ideas').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(normalize(data));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, image, pdfUrl, category } = body;
    const db = supabaseAdmin();
    const { data, error } = await db
      .from('ideas')
      .update({ title, description, image, pdf_url: pdfUrl, category })
      .eq('id', params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ idea: normalize(data) });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { error } = await db.from('ideas').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Idée supprimée' });
}
