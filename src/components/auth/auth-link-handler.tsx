'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, completeMagicLinkSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * Silent component that monitors the URL for tactical authentication handshakes.
 */
export function AuthLinkHandler() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!auth || isProcessing.current) return;

    const handleHandshake = async () => {
      try {
        isProcessing.current = true;
        await completeMagicLinkSignIn(auth);
        
        if (auth.currentUser) {
          toast({
            title: "HANDSHAKE COMPLETE",
            description: "Tactical link established. Welcome back, operator.",
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "PROTOCOL ERROR",
          description: "Authentication handshake failed or link expired.",
        });
      } finally {
        isProcessing.current = false;
      }
    };

    handleHandshake();
  }, [auth, router, toast]);

  return null;
}
