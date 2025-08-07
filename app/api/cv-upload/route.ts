import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';
import { writeFile, unlink, access } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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

    // Determine filename and path
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const cvDir = join(process.cwd(), 'public', 'cv');
    const filePath = join(cvDir, filename);

    // Ensure CV directory exists
    if (!existsSync(cvDir)) {
      mkdirSync(cvDir, { recursive: true });
    }

    // Delete existing file if it exists
    try {
      await access(filePath);
      await unlink(filePath);
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create the URL path for the file
    const fileUrl = `/cv/${filename}`;

    // Update the portfolio data with the new CV
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedCV = {
        ...currentData.cv,
        [language === 'en' ? 'english' : 'japanese']: {
          url: fileUrl,
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
          url: fileUrl
        },
        { status: 200 }
      );
      
    } catch (updateError) {
      // If portfolio update fails, delete the uploaded file
      try {
        await unlink(filePath);
      } catch (deleteError) {
        console.error('Failed to delete uploaded file after portfolio update failure:', deleteError);
      }
      
      return NextResponse.json(
        { error: 'Failed to update CV data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('CV upload error:', error);
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

    // Determine filename and path
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const cvDir = join(process.cwd(), 'public', 'cv');
    const filePath = join(cvDir, filename);

    // Delete the physical file if it exists
    try {
      await access(filePath);
      await unlink(filePath);
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // Update the portfolio data to remove the CV
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const updatedCV = {
        ...currentData.cv,
        [language === 'en' ? 'english' : 'japanese']: {
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
    console.error('CV delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
} 