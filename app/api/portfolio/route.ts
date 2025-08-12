import { NextResponse } from 'next/server';

export const revalidate = 0; // no cache

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Dynamically import to avoid build-time errors
    const { getPortfolioData } = await import('../../lib/portfolioService');
    const data = await getPortfolioData();
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 