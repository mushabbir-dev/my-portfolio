import { NextResponse } from 'next/server';
import { getPortfolioData, setPortfolioData } from '../../lib/portfolioService';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data); // raw doc to match app/page.tsx
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    await setPortfolioData(body);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 