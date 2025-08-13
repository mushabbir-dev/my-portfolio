export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../lib/portfolioService';
import { extractAssetsKeyFromPublicUrl } from '../../lib/storage';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const language = ((form.get('language') as string) || 'en').toLowerCase();
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    const sb = supabaseAdmin();
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, bytes, { upsert: true, contentType: file.type || 'application/pdf' });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    const current = await getPortfolioData();
    const cv = { ...(current.cv ?? {}), [lang]: { isActive: true, url, filename } };
    await updateSection('cv', cv);

    return NextResponse.json({ success: true, url, key });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const languageRaw = (body.language as string | undefined)?.toLowerCase();
    const urlInput = body.url as string | undefined;

    const current = await getPortfolioData();

    let lang: 'english' | 'japanese' | undefined;
    if (languageRaw) lang = languageRaw.startsWith('j') ? 'japanese' : 'english';

    const targetUrl = urlInput ?? (lang ? current?.cv?.[lang]?.url : undefined);
    if (!targetUrl) return NextResponse.json({ error: 'No URL or language provided' }, { status: 400 });

    const key = extractAssetsKeyFromPublicUrl(targetUrl);
    if (!key) return NextResponse.json({ error: 'Could not derive storage key from URL' }, { status: 400 });

    const sb = supabaseAdmin();
    const { error: rmErr } = await sb.storage.from('assets').remove([key]);
    if (rmErr) return NextResponse.json({ error: `Storage remove failed: ${rmErr.message}`, key }, { status: 500 });

    if (lang) {
      const cv = { ...(current.cv ?? {}) };
      cv[lang] = { isActive: false, url: '', filename: '' };
      await updateSection('cv', cv);
    }

    return NextResponse.json({ success: true, keyRemoved: key });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
