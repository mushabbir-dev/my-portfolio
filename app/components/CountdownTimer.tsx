'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  remainingTime: number;
  onExpire: () => void;
}

export default function CountdownTimer({ remainingTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          onExpire();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = timeLeft <= 30000; // 30 seconds warning

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed bottom-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isWarning 
          ? 'bg-red-500 text-white' 
          : 'bg-blue-600 text-white'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="font-mono text-sm">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      {isWarning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-white rounded-full"
        />
      )}
    </motion.div>
  );
} 