export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../lib/portfolioService';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const sb = supabaseAdmin();
    const key = `images/avatar.png`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from('assets').upload(key, bytes, { upsert: true, contentType: file.type || 'image/png' });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    const current = await getPortfolioData();
    const hero = { ...(current.hero ?? {}), profilePicture: url };
    await updateSection('hero', hero);

    return NextResponse.json({ success: true, url, key });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 