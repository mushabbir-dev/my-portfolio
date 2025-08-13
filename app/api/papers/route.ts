export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../lib/portfolioService';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const paperId = form.get('paperId') as string | null;
    const fileType = (form.get('fileType') as string | null) ?? 'pdf';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!paperId) return NextResponse.json({ error: 'No paper ID provided' }, { status: 400 });

    const ext = (file.name?.split('.').pop() || 'pdf').toLowerCase();
    const sb = supabaseAdmin();
    const key = `papers/${Date.now()}_${paperId}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from('assets').upload(key, bytes, { upsert: true, contentType: file.type || 'application/pdf' });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    const current = await getPortfolioData();
    const papers = Array.isArray(current.papers) ? current.papers.slice() : [];
    const idx = papers.findIndex((p:any) => String(p.id) === String(paperId));
    if (idx === -1) return NextResponse.json({ error: 'Paper not found' }, { status: 404 });

    papers[idx] = { 
      ...papers[idx], 
      paperPdf: url, 
      paperFilename: file.name, 
      isActive: true, 
      uploadedAt: new Date().toISOString() 
    };
    await updateSection('papers', papers);

    return NextResponse.json({ success: true, url, key });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 