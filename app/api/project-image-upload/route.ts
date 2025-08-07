import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    console.log('File converted to base64 successfully');

    // Update the project with the new image
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const projects = currentData.projects || [];
      const projectIndex = projects.findIndex((p: any) => p.id === projectId);
      
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      // Add the new image to the project's images array
      const updatedProject = {
        ...projects[projectIndex],
        images: [...(projects[projectIndex].images || []), dataUrl]
      };

      projects[projectIndex] = updatedProject;
      
      await PortfolioService.updateSection('projects', projects);
      
      console.log('Project image updated in portfolio data');
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: dataUrl,
        filename: file.name
      });
      
    } catch (updateError) {
      console.error('Error updating project data:', updateError);
      return NextResponse.json(
        { error: 'Failed to update project data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Project image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload project image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 