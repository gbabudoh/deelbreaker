'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-red-800 mb-1">Group Buy Ended</h3>
        <p className="text-red-600">This deal is no longer available</p>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'from-red-400 to-red-500' },
    { label: 'Hours', value: timeLeft.hours, color: 'from-orange-400 to-orange-500' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'from-yellow-400 to-yellow-500' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'from-green-400 to-green-500' }
  ];

  return (
    <div className="bg-gradient-to-r from-[#E2FBEE] to-[#F4C2B8]/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-[#F3AF7B]" />
        <h3 className="text-lg font-semibold text-gray-800">Time Remaining</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`bg-gradient-to-br ${unit.color} text-white rounded-xl p-4 mb-2 shadow-lg`}>
              <motion.div
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.div>
            </div>
            <div className="text-sm font-medium text-gray-600">{unit.label}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {timeLeft.days > 0 && `${timeLeft.days} days, `}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining
        </p>
      </div>
    </div>
  );
}