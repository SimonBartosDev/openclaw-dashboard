import { NextResponse } from 'next/server';
import { getOverview } from '@/lib/openclaw';

export async function GET() {
  try {
    const data = await getOverview();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
