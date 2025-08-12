'use client';

import { useState, useEffect } from 'react';

export default function UnderConstructionPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate construction progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleMinimize = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
    // Store in localStorage to remember user's choice
    localStorage.setItem('portfolio-under-construction-closed', 'true');
  };

  useEffect(() => {
    // Check if user previously closed the popup
    const wasClosed = localStorage.getItem('portfolio-under-construction-closed');
    if (wasClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`
        relative max-w-md w-full mx-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 
        rounded-2xl shadow-2xl transform transition-all duration-300 ease-out
        ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        animate-pulse
      `}>
        {/* Construction Icon */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-2xl">🚧</span>
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 pb-6 px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 animate-pulse">
            🚧 Portfolio Under Construction 🚧
          </h2>
          
          <p className="text-blue-100 mb-4 leading-relaxed">
            We&apos;re working hard to bring you an amazing portfolio experience! 
            Some features are still being polished and perfected.
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-blue-100 mb-2">
              <span>Construction Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-white/10 rounded-lg p-3 mb-4 text-sm text-blue-100">
            <p className="font-medium">🎯 What&apos;s Coming:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>✨ Enhanced CV Management</li>
              <li>🖼️ Project Image Galleries</li>
              <li>📱 Mobile-First Design</li>
              <li>🚀 Performance Optimizations</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleMinimize}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              Got it! 👍
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              Close ✖️
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-4 w-1 h-1 bg-blue-300 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
