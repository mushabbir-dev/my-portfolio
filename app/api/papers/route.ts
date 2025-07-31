import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// File path for papers storage
const PAPERS_DIR = path.join(process.cwd(), 'public', 'papers');

// Ensure papers directory exists
function ensurePapersDirectory() {
  try {
    fs.accessSync(PAPERS_DIR);
  } catch {
    fs.mkdirSync(PAPERS_DIR, { recursive: true });
  }
}

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

    // Ensure papers directory exists
    ensurePapersDirectory();

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${paperId}_${fileType}_${timestamp}_${originalName}`;
    const filePath = path.join(PAPERS_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/papers/${filename}`;

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

    const filePath = path.join(PAPERS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
} 