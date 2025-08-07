import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../../lib/portfolioService';

// Handle section-specific updates to avoid size limits
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/portfolio/sections - Updating specific section');
    
    const body = await request.json();
    
    if (!body.section || body.data === undefined) {
      return NextResponse.json(
        { error: 'Missing section or data' },
        { status: 400 }
      );
    }

    const result = await PortfolioService.updateSection(body.section, body.data);
    
    if (!result || result.success === false) {
      return NextResponse.json(
        { error: 'Failed to update section' },
        { status: 500 }
      );
    }

    console.log(`Section ${body.section} updated successfully`);
    return NextResponse.json({ 
      message: `Section ${body.section} updated successfully`,
      success: true
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// Get a specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (!section) {
      return NextResponse.json(
        { error: 'Missing section parameter' },
        { status: 400 }
      );
    }

    const portfolioData = await PortfolioService.getPortfolioData();
    const sectionData = portfolioData[section];
    
    if (!sectionData) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      section,
      data: sectionData
    });
  } catch (error) {
    console.error('Error getting section:', error);
    return NextResponse.json(
      { error: 'Failed to get section' },
      { status: 500 }
    );
  }
} 