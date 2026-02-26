import { NextResponse } from 'next/server';
import { getKanban, saveKanban } from '@/lib/openclaw';

function isValidBoard(body) {
  const cols = body?.columns;
  if (!cols) return false;
  const keys = ['backlog', 'in_progress', 'review', 'done'];
  return keys.every((k) => Array.isArray(cols[k]));
}

export async function GET() {
  return NextResponse.json({ ok: true, data: getKanban() });
}

export async function POST(req) {
  try {
    const requiredKey = process.env.DASHBOARD_WRITE_KEY;
    const provided = req.headers.get('x-write-key');
    if (!requiredKey || !provided || provided !== requiredKey) {
      return NextResponse.json({ ok: false, error: 'Unauthorized write' }, { status: 401 });
    }

    const body = await req.json();
    if (!isValidBoard(body)) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, data: saveKanban(body) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
