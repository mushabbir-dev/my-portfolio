import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🚀 CV Upload started');
    
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      console.error('❌ Supabase not configured');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }
    
    console.log('✅ Supabase environment variables found');

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const language = ((form.get('language') as string) || 'en').toLowerCase();

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!['en','ja','jp','japanese','english'].includes(language))
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    
    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
    
    const sb = supabaseAdmin();

    console.log('📁 Uploading to Supabase Storage:', key);
    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, bytes, { upsert: true, contentType: file.type || 'application/pdf' });
    if (upErr) {
      console.error('❌ Upload failed:', upErr);
      throw new Error(`Upload failed: ${upErr.message}`);
    }
    console.log('✅ File uploaded successfully to storage');

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const url = pub.publicUrl;
    console.log('🔗 Public URL generated:', url);

    console.log('💾 Updating portfolio data...');
    const current = await getPortfolioData();
    const cv = {
      ...current.cv,
      [lang]: { isActive: true, url, filename }
    };

    await updateSection('cv', cv);
    console.log('✅ Portfolio data updated successfully');
    return NextResponse.json({ success: true, url, filename });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');
    
    if (!language) {
      return NextResponse.json({ error: 'Language parameter required' }, { status: 400 });
    }

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
    
    const sb = supabaseAdmin();

    // Remove file from storage
    const { error: deleteError } = await sb.storage.from('assets').remove([key]);
    if (deleteError) {
      console.warn('Failed to delete file from storage:', deleteError);
    }

    // Update portfolio data
    const current = await getPortfolioData();
    const cv = {
      ...current.cv,
      [lang]: { isActive: false, url: "", filename: "" }
    };

    await updateSection('cv', cv);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
