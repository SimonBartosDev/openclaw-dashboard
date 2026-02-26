import { NextResponse } from 'next/server';
import { getRuntimeSnapshot } from '@/lib/openclaw';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: getRuntimeSnapshot() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
