import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../../lib/portfolioService';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/logs - Fetching admin logs');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const logs = await PortfolioService.getAdminLogs(limit);
    
    console.log(`Admin logs fetched successfully: ${logs.length} entries`);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin logs' },
      { status: 500 }
    );
  }
} 