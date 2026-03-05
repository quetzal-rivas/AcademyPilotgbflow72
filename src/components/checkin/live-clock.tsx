
"use client";

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LiveClockProps {
  targetTime?: Date;
}

export function LiveClock({ targetTime }: LiveClockProps) {
  const [time, setTime] = useState(new Date());
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      if (targetTime) {
        const diff = targetTime.getTime() - new Date().getTime();
        if (diff > 0) {
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        } else {
          setCountdown('SESSION ACTIVE');
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-muted-foreground uppercase tracking-[0.3em] font-black text-[10px]">
        <Clock className="w-4 h-4 text-primary" />
        Tactical Time
      </div>
      <div className="text-7xl font-black font-headline italic tracking-tighter leading-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </div>
      
      {targetTime && (
        <div className="mt-12 space-y-4">
          <div className="text-muted-foreground uppercase tracking-[0.3em] font-black text-[10px]">Mission Start Countdown</div>
          <div className="text-8xl font-black text-primary font-headline italic tracking-tighter leading-none tabular-nums">
            {countdown}
          </div>
        </div>
      )}
    </div>
  );
}
