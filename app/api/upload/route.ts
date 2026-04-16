import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { extname } from 'path';

export const dynamic = 'force-dynamic';

const BUCKET = 'media';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg',
  'application/pdf',
  'application/zip', 'application/x-zip-compressed', 'application/octet-stream',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 50 MB)' }, { status: 400 });
    }

    const ext      = extname(file.name) || '.bin';
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const filename = `${Date.now()}-${safeName}${ext}`;

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const db = supabaseAdmin();

    /* Upload to Supabase Storage */
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType:  file.type,
        cacheControl: '3600',
        upsert:       false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    /* Get public URL */
    const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(filename);

    return NextResponse.json({
      url:  publicUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
