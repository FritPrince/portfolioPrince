// app/api/contact/route.ts

export const dynamic = 'force-dynamic'; // ⬅️ Ceci force le rendu dynamique

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log("🔵 API /api/contact appelée");
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `Nouveau message depuis le portfolio: ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<h1>Nouveau message</h1><p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' }, { status: 200 });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l\'envoi' }, { status: 500 });
  }
}
