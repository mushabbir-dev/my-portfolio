import { NextResponse } from 'next/server';
import {
  getPortfolioData, getSection, updateSection,
  pushItem, deleteItem
} from '../../../lib/portfolioService';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get('section');
    if (!section) return NextResponse.json({ data: await getPortfolioData() });
    return NextResponse.json({ data: await getSection(section) });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { section, data } = await req.json();
    if (!section) return NextResponse.json({ error: 'Missing section' }, { status: 400 });
    await updateSection(section, data);
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { section, data } = await req.json();
    if (!section || typeof data !== 'object')
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    const current = await getSection<any>(section);
    if (current && Array.isArray(current))
      return NextResponse.json({ error: 'PATCH not for arrays. Use POST/PUT/DELETE or /sections/item.' }, { status: 400 });
    await updateSection(section, { ...(current ?? {}), ...(data ?? {}) });
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { section, item } = await req.json();
    if (!section || !item) return NextResponse.json({ error: 'Missing section or item' }, { status: 400 });
    const created = await pushItem(section, item);
    return NextResponse.json({ success: true, item: created });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { section, id } = await req.json();
    if (!section || !id) return NextResponse.json({ error: 'Missing section or id' }, { status: 400 });
    await deleteItem(section, String(id));
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 