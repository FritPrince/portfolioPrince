import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured  = searchParams.get('featured');

  const db = supabaseAdmin();
  let query = db.from('projects').select('*').order('created_at', { ascending: false });

  if (category && category !== 'all') query = query.eq('category', category);
  if (featured === 'true')            query = query.eq('featured', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Map snake_case → camelCase for frontend compatibility
  const mapped = (data ?? []).map(normalizeProject);
  return NextResponse.json(mapped);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, gallery, technologies, githubUrl, demoUrl, category, featured } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('projects')
      .insert({
        title,
        description,
        image:        image        ?? '',
        gallery:      Array.isArray(gallery) ? gallery : [],
        technologies: Array.isArray(technologies) ? technologies : [],
        github_url:   githubUrl    ?? '',
        demo_url:     demoUrl      ?? '',
        category,
        featured:     featured     ?? false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: 'Projet créé', project: normalizeProject(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProject(p: any) {
  return {
    id:           p.id,
    title:        p.title,
    description:  p.description,
    image:        p.image        ?? '',
    gallery:      p.gallery      ?? [],
    technologies: p.technologies ?? [],
    githubUrl:    p.github_url   ?? '',
    demoUrl:      p.demo_url     ?? '',
    category:     p.category,
    featured:     p.featured     ?? false,
    createdAt:    p.created_at,
  };
}
