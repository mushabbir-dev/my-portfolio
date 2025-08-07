import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Project image upload started');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!projectId) {
      console.log('No project ID provided');
      return NextResponse.json({ error: 'No project ID provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type, 'Project ID:', projectId);

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    console.log('Uploads directory path:', uploadsDir);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Directory created/verified successfully');
    } catch (dirError) {
      console.error('Error creating directory:', dirError);
      return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
      );
    }

    // Check if directory is writable
    try {
      await access(uploadsDir, 2); // Check write permission
      console.log('Directory is writable');
    } catch (accessError) {
      console.error('Directory not writable:', accessError);
      return NextResponse.json(
        { error: 'Upload directory not writable' },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `project-${projectId}-${timestamp}.${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);
    
    console.log('File path:', filePath);

    // Convert file to buffer and save
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log('File written successfully');
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Return the public URL
    const publicUrl = `/uploads/projects/${filename}`;
    console.log('Project image uploaded successfully:', publicUrl);

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Project image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload project image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 