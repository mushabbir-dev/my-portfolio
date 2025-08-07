import { NextRequest, NextResponse } from 'next/server';
// Persist updates to the portfolio using the service layer instead of writing to the file system.
import { PortfolioService } from '../../lib/portfolioService';

// We no longer rely on Node's file system for persistence. Vercel's serverless
// environment is read‑only at runtime, so writing into the `public` folder will
// silently fail. Instead, we convert uploaded PDFs to base64 strings and
// persist them in the portfolio data via the `PortfolioService`. This allows
// uploaded CVs to be stored in the Supabase database (if configured) or the
// JSON fallback file, both of which survive across requests.

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

    // Convert the file into a base64 encoded string. The File API exposes
    // `.arrayBuffer()` which returns an ArrayBuffer. We convert this to
    // a Buffer and then to a base64 string. When rendering on the client,
    // the Data URI can be used directly as the `src` attribute for a link or
    // embed component.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const base64Url = `data:application/pdf;base64,${base64}`;

    // Determine filename based on language. Keep the original naming scheme
    // so the UI remains consistent, but the actual file contents are stored
    // inline as a Data URI. The filename is only for display purposes.
    const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';

    // Load existing portfolio data and update the relevant CV field. The
    // `cv` object has `english` and `japanese` sub objects. We update the
    // selected language while preserving the other.
    const portfolio = await PortfolioService.getPortfolioData();
    const currentCv = portfolio.cv ?? { english: {}, japanese: {} };
    const updatedCv = { ...currentCv } as any;
    if (language === 'en') {
      updatedCv.english = {
        url: base64Url,
        filename: filename,
        isActive: true
      };
    } else {
      updatedCv.japanese = {
        url: base64Url,
        filename: filename,
        isActive: true
      };
    }

    // Persist the updated CV section
    await PortfolioService.updateSection('cv', updatedCv);

    console.log('CV uploaded successfully via Data URI');

    // Return success with the Data URI. The admin UI will store this string in
    // its state and persist it to the backend via `updateData`.
    return NextResponse.json(
      {
        success: true,
        message: `CV uploaded successfully!`,
        filename,
        url: base64Url
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
    // When deleting a CV, expect a `language` query parameter. We remove the
    // corresponding Data URI and mark it as inactive. This updates the
    // portfolio state so the admin UI reflects the change.
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    if (!language) {
      return NextResponse.json(
        { error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    // Load current portfolio and update the CV section
    const portfolio = await PortfolioService.getPortfolioData();
    const currentCv = portfolio.cv ?? { english: {}, japanese: {} };
    const updatedCv = { ...currentCv } as any;
    if (language === 'en') {
      updatedCv.english = {
        url: '',
        filename: '',
        isActive: false
      };
    } else {
      updatedCv.japanese = {
        url: '',
        filename: '',
        isActive: false
      };
    }
    await PortfolioService.updateSection('cv', updatedCv);

    console.log(`CV for language ${language} deleted successfully`);

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