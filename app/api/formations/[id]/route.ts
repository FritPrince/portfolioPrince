import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(f: any) {
  return {
    id: f.id, title: f.title, description: f.description,
    price: f.price ?? 0, type: f.type ?? 'pdf',
    image: f.image ?? '', fileUrl: f.file_url ?? '', createdAt: f.created_at,
  };
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data, error } = await db.from('formations').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(normalize(data));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, price, type, image, fileUrl } = body;
    const db = supabaseAdmin();
    const { data, error } = await db
      .from('formations')
      .update({ title, description, price: Number(price), type, image, file_url: fileUrl })
      .eq('id', params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ formation: normalize(data) });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { error } = await db.from('formations').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Formation supprimée' });
}
