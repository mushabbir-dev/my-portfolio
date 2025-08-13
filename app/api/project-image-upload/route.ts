export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../lib/portfolioService';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('image') as File | null;
    const projectId = (form.get('projectId') as string | null) ?? null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

    const sb = supabaseAdmin();
    const ext = (file.type?.split('/')[1] || 'png').toLowerCase();
    const key = `images/projects/${projectId}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from('assets').upload(key, bytes, { upsert: true, contentType: file.type || 'image/png' });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;

    const current = await getPortfolioData();
    const projects = Array.isArray(current.projects) ? current.projects.slice() : [];
    const idx = projects.findIndex((p:any) => String(p.id) === String(projectId));
    if (idx === -1) return NextResponse.json({ error: 'Project not found in portfolio JSON' }, { status: 404 });

    projects[idx] = { ...projects[idx], imageUrl: url };
    await updateSection('projects', projects);

    return NextResponse.json({ success: true, url, key });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 