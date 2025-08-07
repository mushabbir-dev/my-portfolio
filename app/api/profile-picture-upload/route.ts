import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';

export async function POST(request: NextRequest) {
  try {
  
    
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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    

    // Update the portfolio data with the new profile picture
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedHero = {
        ...currentData.hero,
        profilePicture: dataUrl
      };
      
      await PortfolioService.updateSection('hero', updatedHero);
      
      
      
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