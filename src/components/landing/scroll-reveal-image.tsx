"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * ScrollRevealImage - A tactical component that reveals an image with 
 * a fade-in and slide-up effect triggered by scroll visibility.
 */
export function ScrollRevealImage() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Technical Implementation: Intersection Observer for dynamic visibility toggle
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Scroll-out behavior included: reverts to initial state if it leaves viewport
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1, // 10% visible threshold
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-5xl mx-auto transition-all duration-[800ms] ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-[50px]"
      )}
    >
      <div className="relative aspect-[1200/600] w-full">
        <Image
          src="https://graciebarra.com/wp-content/uploads/2025/03/call_to_action-IMG.png"
          alt="Gracie Barra Team Silhouette"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
      </div>
    </div>
  );
}
