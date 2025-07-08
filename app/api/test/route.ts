// app/api/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "GET OK" });
}

export async function POST() {
  console.log("✅ POST reçu dans /api/test");
  return NextResponse.json({ message: "POST OK" });
}
