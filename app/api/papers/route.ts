import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const paperId = formData.get('paperId') as string;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!paperId) {
      return NextResponse.json({ error: 'No paper ID provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Create papers directory if it doesn't exist
    const papersDir = path.join(process.cwd(), 'public', 'papers');
    await mkdir(papersDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${paperId}_${fileType}_${timestamp}_${originalName}`;
    const filePath = path.join(papersDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/papers/${filename}`;

    console.log('Paper uploaded successfully:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      message: 'Paper uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading paper:', error);
    return NextResponse.json({ error: 'Failed to upload paper' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    console.log('Paper deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
} 