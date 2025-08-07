import { NextRequest, NextResponse } from 'next/server';
// We no longer rely on Node's file system (fs/promises) in production because
// Vercel's serverless environment is read‑only. Instead, we store uploaded
// PDFs as base64 Data URIs via the PortfolioService.
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

    // Convert the PDF into a base64 Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const base64Url = `data:application/pdf;base64,${base64}`;

    // Generate a sanitized filename for display purposes only
    const originalName = (file.name || 'upload.pdf').replace(/[^a-zA-Z0-9.\-]/g, '_');
    const filename = `${paperId}_${fileType}_${Date.now()}_${originalName}`;

    // Update the portfolio's papers section
    const portfolio = await PortfolioService.getPortfolioData();
    const papers: any[] = Array.isArray(portfolio.papers) ? portfolio.papers : [];
    const paperIndex = papers.findIndex((p) => p.id === paperId);
    if (paperIndex === -1) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    const updatedPapers = papers.map((paper, idx) => {
      if (idx === paperIndex) {
        const updates: any = {};
        if (fileType === 'paper') {
          updates.paperPdf = base64Url;
          updates.paperFilename = filename;
        } else if (fileType === 'poster') {
          updates.posterPdf = base64Url;
          updates.posterFilename = filename;
        } else if (fileType === 'presentation') {
          updates.presentationPdf = base64Url;
          updates.presentationFilename = filename;
        }
        return { ...paper, ...updates };
      }
      return paper;
    });

    await PortfolioService.updateSection('papers', updatedPapers);

    console.log(`Paper (${fileType}) uploaded successfully for paper ID ${paperId}`);

    return NextResponse.json({
      success: true,
      url: base64Url,
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
    // Identify the paper and file type to clear the stored Data URI
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paperId');
    const fileType = searchParams.get('fileType');

    if (!paperId || !fileType) {
      return NextResponse.json({ error: 'paperId and fileType parameters are required' }, { status: 400 });
    }

    const portfolio = await PortfolioService.getPortfolioData();
    const papers: any[] = Array.isArray(portfolio.papers) ? portfolio.papers : [];
    const paperIndex = papers.findIndex((p) => p.id === paperId);
    if (paperIndex === -1) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    const updatedPapers = papers.map((paper, idx) => {
      if (idx === paperIndex) {
        const updates: any = {};
        if (fileType === 'paper') {
          updates.paperPdf = '';
          updates.paperFilename = '';
        } else if (fileType === 'poster') {
          updates.posterPdf = '';
          updates.posterFilename = '';
        } else if (fileType === 'presentation') {
          updates.presentationPdf = '';
          updates.presentationFilename = '';
        }
        return { ...paper, ...updates };
      }
      return paper;
    });

    await PortfolioService.updateSection('papers', updatedPapers);

    console.log(`Paper (${fileType}) deleted successfully for paper ID ${paperId}`);

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
} 