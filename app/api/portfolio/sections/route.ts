import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { section, data } = body ?? {};
    if (!section) return NextResponse.json({ error: 'Missing section' }, { status: 400 });

    // Dynamically import to avoid build-time errors
    const { updateSection } = await import('../../../lib/portfolioService');
    await updateSection(section, data);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 