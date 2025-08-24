export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { getPortfolioData, updateSection } from '../../../lib/portfolioService';
import type { Certificate } from '../../../lib/types';
import { nowIso } from '../../../lib/dates';

const SECTION = 'certificates';

export async function POST(req: Request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const certificateId = String(form.get('certificateId') || '');
    const kind = String(form.get('kind') || 'image'); // 'image' | 'pdf'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!certificateId) return NextResponse.json({ error: 'certificateId required' }, { status: 400 });
    if (!['image', 'pdf'].includes(kind)) return NextResponse.json({ error: 'kind must be image|pdf' }, { status: 400 });

    const sb = supabaseAdmin();
    const ext = (file.name.split('.').pop() || (kind === 'pdf' ? 'pdf' : 'jpg')).toLowerCase();
    const ts = Date.now();
    const safeBase = `cert-${certificateId}-${kind}-${ts}.${ext}`;
    const key = `certificates/${safeBase}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await sb.storage
      .from('assets')
      .upload(key, bytes, {
        upsert: true,
        contentType: file.type || (kind === 'pdf' ? 'application/pdf' : 'image/jpeg'),
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = sb.storage.from('assets').getPublicUrl(key);
    const url = publicUrl.publicUrl;

    // update JSONB
    const data = await getPortfolioData();
    const list: Certificate[] = Array.isArray(data?.[SECTION]) ? data[SECTION] : [];
    const idx = list.findIndex((c) => c.id === certificateId);
    if (idx === -1) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });

    const cert = { ...list[idx] };
    if (kind === 'image') {
      cert.imageUrl = url;
      cert.imageKey = key;
    } else {
      cert.pdfUrl = url;
      cert.pdfKey = key;
    }
    cert.updatedAt = nowIso();

    const next = list.map((c, i) => (i === idx ? cert : c));
    await updateSection(SECTION, next);

    return NextResponse.json({ url, key, kind });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
