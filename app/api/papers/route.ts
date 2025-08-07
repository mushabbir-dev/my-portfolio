import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64String}`;

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${paperId}_${fileType}_${timestamp}_${originalName}`;

    // Update the paper with the new file
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const papers = currentData.papers || [];
      const paperIndex = papers.findIndex((p: any) => p.id === paperId);
      
      if (paperIndex === -1) {
        return NextResponse.json(
          { error: 'Paper not found' },
          { status: 404 }
        );
      }

      // Update the paper with the new file
      const updatedPaper = {
        ...papers[paperIndex],
        [fileType + 'Pdf']: dataUrl,
        [fileType + 'Filename']: filename
      };

      papers[paperIndex] = updatedPaper;
      
      await PortfolioService.updateSection('papers', papers);
      
      
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: filename,
        message: 'Paper uploaded successfully'
      });
      
    } catch (updateError) {
      console.error('Error updating paper data:', updateError);
      return NextResponse.json(
        { error: 'Failed to update paper data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error uploading paper:', error);
    return NextResponse.json({ error: 'Failed to upload paper' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const paperId = searchParams.get('paperId');
    const fileType = searchParams.get('fileType');

    if (!filename || !paperId || !fileType) {
      return NextResponse.json({ error: 'Filename, paper ID, and file type are required' }, { status: 400 });
    }

    // Update the paper to remove the file
    try {
      const currentData = await PortfolioService.getPortfolioData();
      const papers = currentData.papers || [];
      const paperIndex = papers.findIndex((p: any) => p.id === paperId);
      
      if (paperIndex === -1) {
        return NextResponse.json(
          { error: 'Paper not found' },
          { status: 404 }
        );
      }

      // Remove the file from the paper
      const updatedPaper = {
        ...papers[paperIndex],
        [fileType + 'Pdf']: '',
        [fileType + 'Filename']: ''
      };

      papers[paperIndex] = updatedPaper;
      
      await PortfolioService.updateSection('papers', papers);
      
      
      
      return NextResponse.json({
        success: true,
        message: 'Paper deleted successfully'
      });
      
    } catch (updateError) {
      console.error('Error updating paper data:', updateError);
      return NextResponse.json(
        { error: 'Failed to update paper data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
} 