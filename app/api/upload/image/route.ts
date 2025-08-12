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
    const target = (form.get('target') as string) || 'profile'; // 'profile' | 'project'
    const projectSlug = (form.get('projectSlug') as string) || '';
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ts = Date.now();
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const baseDir = target === 'project' ? `images/projects/${projectSlug}` : 'images';
    const key = `${baseDir}/${ts}.${ext}`;

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
    
    const sb = supabaseAdmin();
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, bytes, { upsert: true, contentType: file.type || 'image/jpeg' });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    // OPTIONAL: write into portfolio JSON if you keep image URLs there.
    // Example: update profile image
    if (target === 'profile') {
      const current = await getPortfolioData();
      await updateSection('profile', { ...(current.profile ?? {}), imageUrl: url });
    }

    return NextResponse.json({ success: true, url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
