import { NextResponse } from 'next/server';
import { upsertItem } from '../../../../lib/portfolioService';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const section = body?.section as string | undefined;
    const item = body?.item;
    const items = body?.items as any[] | undefined;

    if (!section) return NextResponse.json({ error: 'Missing section' }, { status: 400 });

    if (Array.isArray(items) && items.length) {
      // Handle multiple items by updating them one by one
      const saved = [];
      for (const item of items) {
        const result = await upsertItem(section, item);
        saved.push(result);
      }
      return NextResponse.json({ success: true, items: saved });
    }
    if (!item) return NextResponse.json({ error: 'Provide { item } or { items: [...] }' }, { status: 400 });

    const saved = await upsertItem(section, item);
    return NextResponse.json({ success: true, item: saved });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
