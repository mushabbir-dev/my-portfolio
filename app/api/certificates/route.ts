export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getPortfolioData, updateSection, pushItem, upsertItem, deleteItem } from '../../lib/portfolioService';
import type { Certificate } from '../../lib/types';
import { nowIso } from '../../lib/dates';
import { supabaseAdmin } from '../../lib/supabase-server';
import { extractAssetsKeyFromPublicUrl } from '../../lib/storage';

const SECTION = 'certificates';

function normLocalized(v: any) {
  if (typeof v === 'string') return { english: v, japanese: v };
  return { english: v?.english ?? '', japanese: v?.japanese ?? '' };
}

function normalizeIncoming(body: any): Certificate {
  return {
    id: body.id || crypto.randomUUID(),
    name: normLocalized(body.name),
    issuer: normLocalized(body.issuer),
    institute: body.institute ? normLocalized(body.institute) : undefined,
    date: normLocalized(body.date),
    imageUrl: body.imageUrl || '',
    imageKey: body.imageKey || '',
    pdfUrl: body.pdfUrl || '',
    pdfKey: body.pdfKey || '',
    isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    createdAt: body.createdAt || nowIso(),
    updatedAt: nowIso(),
  };
}

export async function GET() {
  const data = await getPortfolioData();
  const list: Certificate[] = Array.isArray(data?.[SECTION]) ? data[SECTION] : [];
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = normalizeIncoming(body);
  await pushItem(SECTION, item);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const item = normalizeIncoming(body);
  await upsertItem(SECTION, item);
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const id = body?.id as string;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Remove storage files if present
  const sb = supabaseAdmin();
  const data = await getPortfolioData();
  const list: Certificate[] = Array.isArray(data?.[SECTION]) ? data[SECTION] : [];
  const target = list.find((c) => c.id === id);

  if (target) {
    const keys: string[] = [];
    if (target.imageKey) keys.push(target.imageKey);
    if (target.pdfKey) keys.push(target.pdfKey);
    // as a fallback, if key is empty but url exists, try extracting
    if (!target.imageKey && target.imageUrl) {
      const k = extractAssetsKeyFromPublicUrl(target.imageUrl);
      if (k) keys.push(k);
    }
    if (!target.pdfKey && target.pdfUrl) {
      const k = extractAssetsKeyFromPublicUrl(target.pdfUrl);
      if (k) keys.push(k);
    }

    if (keys.length) {
      const { error } = await sb.storage.from('assets').remove(keys.map((k) => `certificates/${k.replace(/^certificates\//,'')}`));
      if (error) {
        // Not fatal; still remove JSONB so admin doesn't get stuck
        console.warn('Storage remove error:', error.message);
      }
    }
  }

  await deleteItem(SECTION, id);
  return NextResponse.json({ success: true });
}
