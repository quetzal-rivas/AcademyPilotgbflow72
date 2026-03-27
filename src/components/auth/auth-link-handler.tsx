'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, completeMagicLinkSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';

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

    const handleHandshake = async () => {
      try {
        isProcessing.current = true;
        await completeMagicLinkSignIn(auth);
        
        if (auth.currentUser) {
          let tenantSlug: string | null = null;
          try {
            const profileRef = doc(db, 'user_profiles', auth.currentUser.uid);
            const profileSnap = await getDoc(profileRef);
            tenantSlug = (profileSnap.data()?.tenantSlug as string | undefined) || null;
          } catch {
            tenantSlug = null;
          }

          toast({
            title: "HANDSHAKE COMPLETE",
            description: "Tactical link established. Welcome back, operator.",
          });

          if (tenantSlug) {
            router.push(`/${tenantSlug}/dashboard`);
          } else {
            router.push('/dashboard');
          }
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
