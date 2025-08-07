import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string;

    if (!file || !language) {
      return NextResponse.json(
        { error: 'File and language are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64String}`;

    // Determine filename based on language
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';

    // Update the portfolio data with the new CV
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedCV = {
        ...currentData.cv,
        [language]: {
          url: dataUrl,
          filename: filename,
          isActive: true
        }
      };
      
      await PortfolioService.updateSection('cv', updatedCV);
      
      return NextResponse.json(
        { 
          success: true, 
          message: `CV uploaded successfully!`,
          filename: filename,
          url: dataUrl
        },
        { status: 200 }
      );
      
    } catch (updateError) {
      return NextResponse.json(
        { error: 'Failed to update CV data' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload CV' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    if (!language) {
      return NextResponse.json(
        { error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    // Update the portfolio data to remove the CV
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedCV = {
        ...currentData.cv,
        [language]: {
          url: '',
          filename: '',
          isActive: false
        }
      };
      
      await PortfolioService.updateSection('cv', updatedCV);
      
      return NextResponse.json(
        { 
          success: true, 
          message: `CV deleted successfully!`
        },
        { status: 200 }
      );
      
    } catch (updateError) {
      return NextResponse.json(
        { error: 'Failed to update CV data' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
} 