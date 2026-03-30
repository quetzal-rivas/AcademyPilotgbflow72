'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, completeMagicLinkSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { isSignInWithEmailLink } from 'firebase/auth';
import { resolvePostAuthDestination } from '@/lib/post-auth-routing';

/**
 * Silent component that monitors the URL for tactical authentication handshakes.
 */
export function AuthLinkHandler() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!auth || isProcessing.current) return;
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    const handleHandshake = async () => {
      try {
        isProcessing.current = true;
        await completeMagicLinkSignIn(auth);
        
        if (auth.currentUser) {
          const url = new URL(window.location.href);
          const authMode = url.searchParams.get('authMode') === 'student' ? 'student' : 'admin';
          const { destination } = await resolvePostAuthDestination(db, auth.currentUser, null, authMode);

          toast({
            title: "HANDSHAKE COMPLETE",
            description: "Tactical link established. Welcome back, operator.",
          });

          router.push(destination);
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
  }, [auth, db, router, toast]);

  return null;
}
