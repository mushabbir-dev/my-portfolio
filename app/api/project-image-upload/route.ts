import { NextRequest, NextResponse } from 'next/server';
// Persist project images in the portfolio instead of writing to the file system.
// Uploaded images are encoded as base64 Data URIs and stored directly in the
// corresponding project's `images` array via the `PortfolioService`. This
// ensures compatibility with serverless environments where the file system
// cannot be modified at runtime.
import { PortfolioService } from '../../lib/portfolioService';
// Import Supabase client to optionally store images in Supabase Storage. If a
// service key is provided via environment variables (`SUPABASE_SERVICE_ROLE`
// or `SUPABASE_SECRET_KEY`), images will be uploaded to the `images` bucket
// and the returned public URL will be stored in the project instead of a
// large base64 string. This avoids exceeding Vercel's 4 MB request limit.
import { createClient } from '@supabase/supabase-js';

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

    // Read the file into a buffer once, to use for both storage upload and
    // base64 encoding.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try uploading to Supabase Storage if available. This keeps project
    // objects small and avoids hitting payload limits when saving the
    // portfolio. If the upload fails or no service key is configured, a
    // base64 Data URI will be used instead.
    let publicUrl: string | null = null;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && serviceKey) {
      try {
        const supabase = createClient(supabaseUrl, serviceKey);
        const fileName = `project_${projectId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
          publicUrl = urlData?.publicUrl ?? null;
          console.log('Project image uploaded to Supabase Storage:', publicUrl);
        } else {
          console.error('Supabase Storage upload error:', uploadError.message);
        }
      } catch (err) {
        console.error('Supabase Storage error:', err);
      }
    }

    // Fallback to base64 Data URI if no storage URL is available.
    const base64Url = `data:${file.type};base64,${buffer.toString('base64')}`;
    const imageUrl = publicUrl || base64Url;

    // Load existing portfolio and find the project by ID
    const portfolio = await PortfolioService.getPortfolioData();
    const projects: any[] = Array.isArray(portfolio.projects) ? portfolio.projects : [];
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      console.log('Project not found:', projectId);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Append the new image (URL or base64) to the project's images array
    const updatedProjects = projects.map((project, idx) => {
      if (idx === projectIndex) {
        const images = Array.isArray(project.images) ? project.images : [];
        return {
          ...project,
          images: [...images, imageUrl]
        };
      }
      return project;
    });

    await PortfolioService.updateSection('projects', updatedProjects);

    console.log('Project image uploaded successfully');

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: file.name
    });

  } catch (error) {
    console.error('Project image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload project image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 