import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(f: any) {
  return {
    id:          f.id,
    title:       f.title,
    description: f.description,
    price:       f.price ?? 0,
    type:        f.type ?? 'pdf',
    image:       f.image ?? '',
    fileUrl:     f.file_url ?? '',
    createdAt:   f.created_at,
  };
}

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(normalize));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, type, image, fileUrl } = body;

    if (!title || !description || price === undefined || !type) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('formations')
      .insert({ title, description, price: Number(price), type, image: image ?? '', file_url: fileUrl ?? '' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Formation créée', formation: normalize(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
