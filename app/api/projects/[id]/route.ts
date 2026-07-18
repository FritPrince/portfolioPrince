import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/* Le code d'accès ne sort JAMAIS d'ici : si un projet est protégé,
   on masque aussi son URL de démo (délivrée par ./unlock uniquement). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProject(p: any) {
  const locked = typeof p.code === 'string' && p.code.trim().length > 0;
  return {
    id:           p.id,
    title:        p.title,
    description:  p.description,
    image:        p.image        ?? '',
    gallery:      p.gallery      ?? [],
    technologies: p.technologies ?? [],
    githubUrl:    p.github_url   ?? '',
    demoUrl:      locked ? '' : (p.demo_url ?? ''),
    category:     p.category,
    featured:     p.featured     ?? false,
    hasCode:      locked,
    createdAt:    p.created_at,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
  return NextResponse.json(normalizeProject(data));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, image, gallery, technologies, githubUrl, demoUrl, category, featured, code, removeCode } = body;

    /* Code d'accès : champ tapé → nouveau code ; case « supprimer » → null ;
       sinon on ne touche pas au code existant. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const codePatch: Record<string, any> = {};
    if (removeCode === true) codePatch.code = null;
    else if (typeof code === 'string' && code.trim()) codePatch.code = code.trim();

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('projects')
      .update({
        title,
        description,
        image,
        gallery:      Array.isArray(gallery) ? gallery : [],
        technologies: Array.isArray(technologies) ? technologies : [],
        github_url:   githubUrl,
        demo_url:     demoUrl,
        category,
        featured,
        ...codePatch,
        updated_at:   new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Projet mis à jour', project: normalizeProject(data) });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = supabaseAdmin();
    const { error } = await db.from('projects').delete().eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Projet supprimé' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
