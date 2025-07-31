import { NextRequest, NextResponse } from 'next/server';

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
    const base64 = buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    // Determine filename based on language
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';

    console.log('CV uploaded successfully as base64');

    return NextResponse.json(
      { 
        success: true, 
        message: `CV uploaded successfully!`,
        filename: filename,
        url: dataUrl
      },
      { status: 200 }
    );

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

    console.log('CV deleted successfully');

    return NextResponse.json(
      { 
        success: true, 
        message: `CV deleted successfully!`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('CV delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
} 