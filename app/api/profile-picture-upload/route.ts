import { NextRequest, NextResponse } from 'next/server';
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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    console.log('File converted to base64 successfully');

    // Update the portfolio data with the new profile picture
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedHero = {
        ...currentData.hero,
        profilePicture: dataUrl
      };
      
      await PortfolioService.updateSection('hero', updatedHero);
      
      console.log('Profile picture updated in portfolio data');
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
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