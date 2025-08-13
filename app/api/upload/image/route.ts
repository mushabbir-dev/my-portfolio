export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../../lib/portfolioService';
import { extractAssetsKeyFromPublicUrl } from '../../../lib/storage';

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

// DELETE: remove image from Storage
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urlInput = body.url as string | undefined;

    if (!urlInput) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const key = extractAssetsKeyFromPublicUrl(urlInput);
    if (!key) {
      return NextResponse.json({ error: 'Could not derive storage key from URL' }, { status: 400 });
    }

    const sb = supabaseAdmin();
    const { error: rmErr } = await sb.storage.from('assets').remove([key]);
    if (rmErr) {
      return NextResponse.json({ error: `Storage remove failed: ${rmErr.message}`, key }, { status: 500 });
    }

    return NextResponse.json({ success: true, keyRemoved: key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
