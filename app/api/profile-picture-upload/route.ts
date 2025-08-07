import { NextRequest, NextResponse } from 'next/server';
// Instead of writing to the local file system (which is read‑only on Vercel
// serverless functions), persist profile pictures in the portfolio via the
// `PortfolioService`. The uploaded image is converted to a base64 Data URI
// and stored directly in the `hero.profilePicture` field.
import { PortfolioService } from '../../lib/portfolioService';
// Import Supabase client for optional storage uploads. Using the service role
// key allows writing to buckets without exposing the key on the client. If
// `SUPABASE_SERVICE_ROLE` or `SUPABASE_SECRET_KEY` is not defined, the
// fallback will be to store images as Data URIs in the JSON. Keeping large
// images out of JSON prevents hitting the 4 MB body limit when updating
// portfolio data on Vercel. See https://vercel.com/docs/limits/overview.
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile picture upload started');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Read the file into a buffer to either upload to Supabase Storage or
    // encode as base64. We do this once up front to avoid multiple reads.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Attempt to upload the image to Supabase Storage if a service key is
    // configured. Using storage offloads large binary data away from the
    // portfolio JSON and avoids exceeding the 4 MB payload limit on Vercel.
    let publicUrl: string | null = null;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && serviceKey) {
      try {
        const supabase = createClient(supabaseUrl, serviceKey);
        // Ensure there's a bucket named "images". If the bucket doesn't exist,
        // the upload will fail; instruct the user to create it in Supabase.
        const fileName = `profile_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
          publicUrl = urlData?.publicUrl ?? null;
          console.log('Profile picture uploaded to Supabase Storage:', publicUrl);
        } else {
          console.error('Supabase Storage upload error:', uploadError.message);
        }
      } catch (err) {
        console.error('Supabase Storage error:', err);
      }
    }

    // Fallback: convert the file to a base64 encoded Data URI. This avoids
    // writing to disk, which is not possible on Vercel. Use the `file.type`
    // to set the MIME correctly so it can be used directly in an <img> tag.
    const base64Url = `data:${file.type};base64,${buffer.toString('base64')}`;
    const profilePictureUrl = publicUrl || base64Url;

    // Update the hero section with either the storage URL or base64 Data URI.
    const portfolio = await PortfolioService.getPortfolioData();
    const hero = portfolio.hero ?? {};
    const updatedHero = {
      ...hero,
      profilePicture: profilePictureUrl
    };
    await PortfolioService.updateSection('hero', updatedHero);

    console.log('Profile picture uploaded successfully');

    return NextResponse.json({
      success: true,
      url: profilePictureUrl,
      message: 'Profile picture uploaded successfully'
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 