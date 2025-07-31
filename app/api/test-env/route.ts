import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Not set',
      CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'Not set',
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    console.log('🔍 Environment check:', envCheck);

    return NextResponse.json({
      success: true,
      environment: envCheck
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      { error: 'Failed to check environment' },
      { status: 500 }
    );
  }
} 