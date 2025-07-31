import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

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

    // Determine filename based on language
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const filePath = join(process.cwd(), 'public', 'cv', filename);

    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file to public/cv folder
      await writeFile(filePath, buffer);



      return NextResponse.json(
        { 
          success: true, 
          message: `CV uploaded successfully!`,
          filename: filename
        },
        { status: 200 }
      );

    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: 'Failed to save CV file' },
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

    // Determine filename based on language
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const filePath = join(process.cwd(), 'public', 'cv', filename);

    try {
      // Check if file exists before trying to delete
      const fs = await import('fs/promises');
      try {
        await fs.access(filePath);
        // File exists, delete it
        await unlink(filePath);


        return NextResponse.json(
          { 
            success: true, 
            message: `CV deleted successfully!`
          },
          { status: 200 }
        );
      } catch (accessError) {
        // File doesn't exist, but that's okay for deletion

        return NextResponse.json(
          { 
            success: true, 
            message: `CV deleted successfully!`
          },
          { status: 200 }
        );
      }

    } catch (deleteError) {
      console.error('Error deleting file:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete CV file' },
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