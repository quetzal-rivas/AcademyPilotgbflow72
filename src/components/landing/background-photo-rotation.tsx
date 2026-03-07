
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface BackgroundPhotoRotationProps {
  photoUrls: string[];
}

export function BackgroundPhotoRotation({ photoUrls }: BackgroundPhotoRotationProps) {
  const [index, setIndex] = useState(0);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (photoUrls.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % photoUrls.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [photoUrls]);

  if (photoUrls.length === 0) return null;

  // Process the photo URLs to handle Google Places resource names
  const currentPhoto = photoUrls[index];
  const formattedUrl = currentPhoto.startsWith('places/') 
    ? `https://places.googleapis.com/v1/${currentPhoto}/media?key=${apiKey}&maxWidthPx=1024`
    : currentPhoto;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={formattedUrl}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.6, x: 0 }} // Increased opacity for better tactical visibility
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={formattedUrl}
            alt="Academy Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      </AnimatePresence>
      {/* Refined gradient stops to let more of the image through on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/60 to-secondary/20" />
    </div>
  );
}
