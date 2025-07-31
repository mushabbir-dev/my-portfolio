'use client';

import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CountdownTimer from '../components/CountdownTimer';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Code, 
  GraduationCap, 
  Award, 
  MessageSquare, 
  LogOut,
  Eye,
  Save,
  X
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, remainingTime, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    
    // Check if we're on the login page
    const isLoginPage = window.location.pathname === '/admin/login';
    
    if (!isAuthenticated && !isLoginPage) {
      
      router.push('/admin/login');
    } else if (isAuthenticated && isLoginPage) {
      
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  // Show loading spinner while not mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we're on the login page, just render children
  if (mounted && window.location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, show loading
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portfolio Admin
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Live Preview
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Site
              </a>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <nav className="p-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Portfolio Admin Panel
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                Navigation
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Use the main content area to edit your portfolio sections.
              </div>
              <div className="pt-4 space-y-1">
                <button onClick={() => window.location.href = '/admin?section=hero'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Hero Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=about'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  About Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=education'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Education Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=skills'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Skills Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=projects'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Projects Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=certifications'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Certifications Section
                </button>
                <button onClick={() => window.location.href = '/admin?section=contact'} className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Contact Section
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Countdown Timer */}
      {remainingTime > 0 && (
        <CountdownTimer 
          remainingTime={remainingTime} 
          onExpire={logout} 
        />
      )}
    </div>
  );
} 