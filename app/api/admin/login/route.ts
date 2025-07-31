import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Simple authentication (replace with proper auth in production)
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({ 
        success: true, 
        token: 'dummy-admin-token',
        message: 'Login successful' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
} 