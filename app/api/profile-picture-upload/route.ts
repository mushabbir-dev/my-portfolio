import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const ts = Date.now();
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const key = `images/profile-${ts}.${ext}`;

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../lib/portfolioService');
    
    const sb = supabaseAdmin();
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb.storage.from('assets')
      .upload(key, bytes, { upsert: true, contentType: file.type });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
    const imageUrl = pub.publicUrl;

    // Update the portfolio data with the new profile picture
    try {
      const currentData = await getPortfolioData();
      const updatedHero = {
        ...currentData.hero,
        profilePicture: imageUrl
      };
      
      await updateSection('hero', updatedHero);
      
      return NextResponse.json({
        success: true,
        url: imageUrl,
        message: 'Profile picture uploaded successfully'
      });
      
    } catch (updateError) {
      console.error('Error updating portfolio data:', updateError);
      return NextResponse.json(
        { error: 'Failed to update portfolio data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 