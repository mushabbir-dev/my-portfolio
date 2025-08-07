import { NextRequest, NextResponse } from 'next/server';
// Instead of writing to the local file system (which is read‑only on Vercel
// serverless functions), persist profile pictures in the portfolio via the
// `PortfolioService`. The uploaded image is converted to a base64 Data URI
// and stored directly in the `hero.profilePicture` field.
import { PortfolioService } from '../../lib/portfolioService';

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

    // Convert the file to a base64 encoded Data URI. This avoids writing to
    // disk, which is not possible on Vercel. Use the `file.type` to set the
    // MIME correctly so it can be used directly in an <img> tag.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const base64Url = `data:${file.type};base64,${base64}`;

    // Load current portfolio hero and update the profile picture field
    const portfolio = await PortfolioService.getPortfolioData();
    const hero = portfolio.hero ?? {};
    const updatedHero = {
      ...hero,
      profilePicture: base64Url
    };
    await PortfolioService.updateSection('hero', updatedHero);

    console.log('Profile picture uploaded successfully via Data URI');

    return NextResponse.json({
      success: true,
      url: base64Url,
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