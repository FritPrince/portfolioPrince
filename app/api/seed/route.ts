import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { projects, experiences, services, skills } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST() {
  const db = supabaseAdmin();
  const results: Record<string, string> = {};

  /* ── Projects ────────────────────────────────────────────────── */
  const { error: pErr } = await db.from('projects').upsert(
    projects.map((p) => ({
      id:           p.id,
      title:        p.title,
      description:  p.description,
      image:        p.image        ?? '',
      technologies: p.technologies ?? [],
      github_url:   p.githubUrl    ?? '',
      demo_url:     p.demoUrl      ?? '',
      category:     p.category,
      featured:     p.featured     ?? false,
    })),
    { onConflict: 'id' }
  );
  results.projects = pErr ? `❌ ${pErr.message}` : `✅ ${projects.length} insérés`;

  /* ── Experiences ─────────────────────────────────────────────── */
  const { error: eErr } = await db.from('experiences').upsert(
    experiences.map((e, i) => ({
      id:             e.id,
      company:        e.company,
      role:           e.role,
      role_en:        e.roleEn        ?? '',
      period:         e.period,
      location:       e.location      ?? '',
      description:    e.description,
      description_en: e.descriptionEn ?? '',
      technologies:   e.technologies  ?? [],
      current:        e.current       ?? false,
      type:           e.type          ?? 'work',
      sort_order:     i,
    })),
    { onConflict: 'id' }
  );
  results.experiences = eErr ? `❌ ${eErr.message}` : `✅ ${experiences.length} insérés`;

  /* ── Services ────────────────────────────────────────────────── */
  const { error: sErr } = await db.from('services').upsert(
    services.map((s, i) => ({
      id:             s.id,
      icon:           s.icon           ?? '',
      title:          s.title,
      title_en:       s.titleEn        ?? '',
      description:    s.description,
      description_en: s.descriptionEn  ?? '',
      technologies:   s.technologies   ?? [],
      sort_order:     i,
    })),
    { onConflict: 'id' }
  );
  results.services = sErr ? `❌ ${sErr.message}` : `✅ ${services.length} insérés`;

  /* ── Skills ──────────────────────────────────────────────────── */
  // Delete all and re-insert (skills have no stable ID in lib/data.ts)
  await db.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: skErr } = await db.from('skills').insert(
    skills.map((sk, i) => ({
      name:       sk.name,
      category:   sk.category,
      sort_order: i,
    }))
  );
  results.skills = skErr ? `❌ ${skErr.message}` : `✅ ${skills.length} insérés`;

  return NextResponse.json({ success: true, results });
}
