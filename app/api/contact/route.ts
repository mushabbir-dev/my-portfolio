import { NextRequest, NextResponse } from 'next/server';

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

    // Log the contact form submission


    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! I will get back to you soon.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 