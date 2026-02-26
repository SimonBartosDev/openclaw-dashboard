import { NextResponse } from 'next/server';
import { getKanban, saveKanban } from '@/lib/openclaw';

export async function GET() {
  return NextResponse.json({ ok: true, data: getKanban() });
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.columns) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, data: saveKanban(body) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
