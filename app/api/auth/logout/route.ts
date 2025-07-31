import { NextRequest, NextResponse } from 'next/server';
import sessionStore from '@/lib/sessionStore';

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Remove session
    const session = sessionStore.getSession(sessionToken);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    sessionStore.deleteSession(sessionToken);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 