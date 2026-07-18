import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/* Vérifie le code d'accès d'un projet protégé.
   C'est LA seule porte qui délivre l'URL de démo d'un projet verrouillé —
   le code et l'URL ne transitent jamais par les GET publics. */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { code } = await request.json();
    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ ok: false, error: 'Code requis' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('projects')
      .select('code, demo_url')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: 'Projet non trouvé' }, { status: 404 });
    }

    if (!data.code || data.code.trim() !== code.trim()) {
      // Petite friction anti-essais en rafale
      await new Promise(r => setTimeout(r, 800));
      return NextResponse.json({ ok: false, error: 'Code incorrect' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, demoUrl: data.demo_url ?? '' });
  } catch {
    return NextResponse.json({ ok: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
