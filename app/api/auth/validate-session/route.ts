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

    

    const session = sessionStore.getSession(sessionToken);

    if (!session) {
      
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const now = Date.now();
    const sessionAge = now - session.loginTime;
    const timeSinceLastActivity = now - session.lastActivity;

    

    // Check 30-minute timeout
    if (sessionAge > 30 * 60 * 1000) {
      
      sessionStore.deleteSession(sessionToken);
      return NextResponse.json(
        { error: 'Session expired (30 minutes)' },
        { status: 401 }
      );
    }

    // Check 10-minute inactivity timeout
    if (timeSinceLastActivity > 10 * 60 * 1000) {
      
      sessionStore.deleteSession(sessionToken);
      return NextResponse.json(
        { error: 'Session expired (inactivity)' },
        { status: 401 }
      );
    }

    // Update last activity
    sessionStore.updateSessionActivity(sessionToken);

    const remainingTime = 30 * 60 * 1000 - sessionAge;

    

    return NextResponse.json(
      { 
        success: true, 
        session: {
          userId: session.userId,
          loginTime: session.loginTime,
          lastActivity: session.lastActivity,
          remainingTime
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 