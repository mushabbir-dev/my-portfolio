'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  sessionToken: string | null;
  remainingTime: number;
  isLoading: boolean;
  logout: () => void;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    if (sessionToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
    setSessionToken(null);
    setRemainingTime(0);
    setLastActivity(Date.now());
    setIsLoading(false);

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }, [sessionToken]);

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken: token }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setSessionToken(token);
        setRemainingTime(data.session.remainingTime);
      } else {
        // Don't logout immediately, just clear the invalid token
        localStorage.removeItem('adminSessionToken');
        localStorage.removeItem('adminLoginTime');
        setIsAuthenticated(false);
        setSessionToken(null);
        setRemainingTime(0);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // Don't logout on network errors, just clear the token
      localStorage.removeItem('adminSessionToken');
      localStorage.removeItem('adminLoginTime');
      setIsAuthenticated(false);
      setSessionToken(null);
      setRemainingTime(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('adminSessionToken');
        if (token) {
          await validateSession(token);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Activity tracking
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Session validation interval
  useEffect(() => {
    if (!sessionToken) return;

    const interval = setInterval(() => {
      validateSession(sessionToken);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [sessionToken]);

  // Inactivity timeout
  useEffect(() => {
    if (!sessionToken) return;

    const inactivityTimeout = setTimeout(() => {
      if (Date.now() - lastActivity > 10 * 60 * 1000) { // 10 minutes
        logout();
      }
    }, 60000); // Check every minute

    return () => clearTimeout(inactivityTimeout);
  }, [sessionToken, lastActivity, logout]);

  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        sessionToken,
        remainingTime,
        isLoading,
        logout,
        updateActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 