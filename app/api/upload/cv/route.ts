import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const language = ((form.get('language') as string) || 'en').toLowerCase();

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!['en','ja','jp','japanese','english'].includes(language))
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    
    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
    
    const sb = supabaseAdmin();

    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, bytes, { upsert: true, contentType: file.type || 'application/pdf' });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    const current = await getPortfolioData();
    const cv = {
      ...current.cv,
      [lang]: { isActive: true, url, filename }
    };

    await updateSection('cv', cv);
    return NextResponse.json({ success: true, url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
