// Shared session store for managing OTPs and active sessions
// In production, use Redis or a database

interface OTPData {
  otp: string;
  expires: number;
}

interface SessionData {
  userId: string;
  loginTime: number;
  lastActivity: number;
  sessionId: string;
}

class SessionStore {
  private otpStore = new Map<string, OTPData>();
  private activeSessions = new Map<string, SessionData>();

  constructor() {
    // Initialize with some persistence for development
    this.loadFromMemory();
  }

  // For development, we'll use a simple in-memory approach
  // In production, this would be Redis or a database

  // OTP Management
  setOTP(sessionId: string, otp: string, expires: number) {
    this.otpStore.set(sessionId, { otp, expires });

  }

  getOTP(sessionId: string): OTPData | undefined {
    const data = this.otpStore.get(sessionId);

    return data;
  }

  deleteOTP(sessionId: string) {
    this.otpStore.delete(sessionId);
  }

  // Session Management
  setSession(sessionToken: string, sessionData: SessionData) {
    this.activeSessions.set(sessionToken, sessionData);

  }

  getSession(sessionToken: string): SessionData | undefined {
    const session = this.activeSessions.get(sessionToken);

    return session;
  }

  deleteSession(sessionToken: string) {
    this.activeSessions.delete(sessionToken);
  }

  updateSessionActivity(sessionToken: string) {
    const session = this.activeSessions.get(sessionToken);
    if (session) {
      session.lastActivity = Date.now();
      this.activeSessions.set(sessionToken, session);
    }
  }

  // Cleanup expired sessions
  cleanup() {
    const now = Date.now();
    
    // Cleanup expired OTPs
    for (const [sessionId, data] of this.otpStore.entries()) {
      if (now > data.expires) {
        this.otpStore.delete(sessionId);
      }
    }

    // Cleanup expired sessions
    for (const [sessionToken, session] of this.activeSessions.entries()) {
      const sessionAge = now - session.loginTime;
      const timeSinceLastActivity = now - session.lastActivity;

      if (sessionAge > 30 * 60 * 1000 || timeSinceLastActivity > 10 * 60 * 1000) {
        this.activeSessions.delete(sessionToken);
      }
    }
  }

  // Development persistence methods
  private loadFromMemory() {
    // For development, we'll keep sessions in memory
    // In production, this would load from Redis or database
  }

  private saveToMemory() {
    // For development, we'll keep sessions in memory
    // In production, this would save to Redis or database
  }
}

// Global session store that persists across server restarts
declare global {
  var __sessionStore: SessionStore | undefined;
}

function getSessionStore(): SessionStore {
  if (!global.__sessionStore) {
    global.__sessionStore = new SessionStore();
    
    // Cleanup every 5 minutes
    setInterval(() => {
      global.__sessionStore?.cleanup();
    }, 5 * 60 * 1000);
  }
  return global.__sessionStore;
}

const sessionStore = getSessionStore();

export default sessionStore; 