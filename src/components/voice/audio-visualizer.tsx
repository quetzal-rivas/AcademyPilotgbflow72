'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isAnimating: boolean;
}

export function AudioVisualizer({ isAnimating }: AudioVisualizerProps) {
  const [delays, setDelays] = useState<string[]>([]);

  useEffect(() => {
    const randomDelays = Array.from(
      { length: 16 },
      () => `-${(Math.random() * 1.5).toFixed(1)}s`
    );
    setDelays(randomDelays);
  }, []);

  return (
    <div className="flex h-20 items-center justify-center rounded-none bg-black/40 border border-border">
      <div className="flex h-10 items-end gap-1">
        {delays.map((delay, i) => (
          <div
            key={i}
            className={cn(
              'w-1.5 rounded-none bg-primary',
              isAnimating ? 'animate-wave' : 'scale-y-[0.2]'
            )}
            style={{ animationDelay: delay, transformOrigin: 'bottom' }}
          />
        ))}
      </div>
    </div>
  );
}
