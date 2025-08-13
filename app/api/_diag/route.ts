export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const admin = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export async function GET() {
  const r:any = { env: {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
  }};
  try {
    const sb = admin();
    const { data, error } = await sb.from('portfolio').select('id').eq('id', 1).single();
    r.db = { ok: !error, rowFound: !!data, error: error?.message };

    const key = `diagnostics/${Date.now()}.txt`;
    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, new TextEncoder().encode('ok\n'), { upsert: true, contentType: 'text/plain' });
    if (upErr) r.storage = { ok: false, error: upErr.message };
    else r.storage = { ok: true, key };

    return NextResponse.json(r, { status: (r.db?.ok && r.storage?.ok) ? 200 : 500 });
  } catch (e:any) {
    r.error = e.message;
    return NextResponse.json(r, { status: 500 });
  }
}
