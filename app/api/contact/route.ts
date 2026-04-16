import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

/* ── GET — liste des messages (admin) ───────────────────────── */
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/* ── POST — soumettre un message depuis le formulaire ────────── */
export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const db = supabaseAdmin();

    /* 1. Sauvegarder en base */
    const { error: dbError } = await db.from('messages').insert({
      name:    name.trim(),
      email:   email.trim(),
      subject: subject?.trim() ?? '',
      message: message.trim(),
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      // On continue quand même pour envoyer l'email
    }

    /* 2. Envoyer l'email (optionnel — ne bloque pas si non configuré) */
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });
        await transporter.sendMail({
          from:    process.env.GMAIL_USER,
          to:      process.env.GMAIL_USER,
          subject: `[Portfolio] ${subject ?? 'Nouveau message'} — ${name}`,
          html: `
            <h2>Nouveau message depuis le portfolio</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject ?? '—'}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          `,
        });
      } catch (mailErr) {
        console.error('Email send failed:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Message envoyé' }, { status: 200 });
  } catch (err) {
    console.error('Contact POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/* ── PATCH — marquer un message comme lu ────────────────────── */
export async function PATCH(request: NextRequest) {
  try {
    const { id, read } = await request.json();
    const db = supabaseAdmin();
    const { error } = await db.from('messages').update({ read }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
