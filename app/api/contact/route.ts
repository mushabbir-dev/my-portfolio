import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createContactEmail } from '../../lib/emailService';

// Target email for contact form
const TARGET_EMAIL = process.env.CONTACT_EMAIL || 'mushabbirahmed99@gmail.com';

// Send contact form email using Resend
async function sendContactEmail(name: string, email: string, message: string) {
  try {
    console.log('📧 Sending contact form via Resend...');
    
    const emailData = createContactEmail(name, email, message, TARGET_EMAIL);
    const result = await sendEmail(emailData);
    
    if (result.success) {
      console.log('📧 Contact form sent successfully via Resend');
      return { success: true };
    } else {
      console.error('📧 Failed to send contact form via Resend:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('📧 Contact form email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if sender email is the same as target email
    if (email.toLowerCase() === 'mushabbirahmed99@gmail.com') {
      return NextResponse.json(
        { error: 'Please use a different email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const emailResult = await sendContactEmail(name, email, message);

    if (emailResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message sent successfully! I will get back to you soon.'
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 