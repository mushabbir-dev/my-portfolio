'use client';

import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative mt-20 border-t">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} Mushabbir Ahmed · All rights reserved
        </p>
        <div className="flex items-center gap-3">
          <a href="mailto:mushabbirahmed99@gmail.com" className="icon-btn" aria-label="Email"><Mail /></a>
          <a href="https://github.com/mushabbir-dev" target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub"><Github /></a>
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn"><Linkedin /></a>
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg border bg-white/80 dark:bg-zinc-900/80 backdrop-blur hover:scale-105 transition"
          aria-label="Back to top"
        >
          <ArrowUp />
        </button>
      )}
      <style jsx global>{`
        .icon-btn { 
          display:inline-flex; align-items:center; justify-content:center; 
          width:38px; height:38px; border-radius:10px; border:1px solid rgba(0,0,0,0.1);
          transition: transform .15s ease;
        }
        .icon-btn:hover { transform: translateY(-2px) }
        .dark .icon-btn { border-color: rgba(255,255,255,0.15); }
      `}</style>
    </footer>
  );
}
