import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sessionStore from '../../../lib/sessionStore';
import { sendEmail, createOTPEmail } from '../../../lib/emailService';

// Hashed credentials (ahmed:Ahmed@2025)
const VALID_CREDENTIALS = {
  userId: process.env.ADMIN_USER_ID || 'ahmed',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '757162ad31b07cbf9291d629916881410ace61bbb6b1067721ea8cde107c4e57' // SHA-256 hash of Ahmed@2025
};

// Target email for OTP
const TARGET_EMAIL = process.env.ADMIN_EMAIL || 'mushabbirahmed99@gmail.com';

// Send OTP email using Resend
async function sendOTPEmail(otp: string) {
  try {
    
    
    const emailData = createOTPEmail(otp, TARGET_EMAIL);
    const result = await sendEmail(emailData);
    
    if (result.success) {
      
      return { success: true };
    } else {
      console.error('📧 Failed to send OTP via Resend:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('📧 OTP email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    // Validate required fields
    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    // Hash the provided password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Validate credentials
    if (userId !== VALID_CREDENTIALS.userId || passwordHash !== VALID_CREDENTIALS.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid user ID or password' },
        { status: 401 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    sessionStore.setOTP(sessionId, otp, expires);

    // Send OTP via Resend
    try {
      const emailResult = await sendOTPEmail(otp);

      if (emailResult.success) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Verification code sent to your email.',
            sessionId
          },
          { status: 200 }
        );
      } else {
        console.error('Email error:', emailResult.error);
        
        // Return error instead of exposing OTP
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to send OTP. Please try again later.',
            sessionId
          },
          { status: 500 }
        );
      }

    } catch (emailError) {
      console.error('Email error:', emailError);
      
      // Return error instead of exposing OTP
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send OTP. Please try again later.',
          sessionId
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 