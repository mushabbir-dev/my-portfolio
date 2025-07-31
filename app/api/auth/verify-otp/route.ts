import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sessionStore from '@/lib/sessionStore';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, otp } = await request.json();

    // Validate required fields
    if (!sessionId || !otp) {
      return NextResponse.json(
        { error: 'Session ID and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP data
    const storedData = sessionStore.getOTP(sessionId);
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'Invalid session. Please login again.' },
        { status: 401 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expires) {
      sessionStore.deleteOTP(sessionId);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 401 }
      );
    }

    // Verify OTP
    if (otp !== storedData.otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    // Clear OTP from store
    sessionStore.deleteOTP(sessionId);

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const loginTime = Date.now();
    const lastActivity = Date.now();

    const sessionData = {
      userId: 'ahmed',
      loginTime,
      lastActivity,
      sessionId: sessionToken
    };
    
    sessionStore.setSession(sessionToken, sessionData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        sessionToken,
        loginTime,
        expiresIn: 30 * 60 * 1000 // 30 minutes in milliseconds
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 