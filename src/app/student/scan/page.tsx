
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScanner from 'react-qr-barcode-scanner';
import { AlertCircle, Loader2, Camera, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCheckIn } from '@/context/checkin-context';

export default function StudentScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { markAsScanned } = useCheckIn();

  const handleScan = (err: any, result: any) => {
    if (result) {
      setIsScanning(true);
      toast({ title: "MATRIX SYNCHRONIZED", description: "Identity verified. Establishing encrypted tactical link." });
      markAsScanned();
      setTimeout(() => router.push('/student/dashboard'), 1500);
    }
  };
  
  const handleCameraError = (error: any) => {
    console.error('Camera Error:', error);
    setError(true);
    toast({ variant: 'destructive', title: 'CAMERA LINK FAILED', description: 'Enable permissions to activate scanner matrix.' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.1)_1px,rgba(255,255,255,0.1)_2px)] bg-[length:100%_2px]" />
      </div>

      <div className="w-full max-w-md space-y-12 animate-in fade-in duration-700 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-primary/10 rounded-none border-4 border-primary rotate-45 mb-6">
            <Camera className="w-10 h-10 text-primary -rotate-45" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Matrix Link</h1>
          <p className="text-primary font-black uppercase text-[10px] tracking-[0.4em] italic">Tactical Verification Protocol</p>
        </div>

        <div className="relative group aspect-square w-full">
           <div className="absolute -inset-6 bg-primary rounded-none blur-3xl opacity-5 group-hover:opacity-15 transition duration-1000"></div>
           <div className="relative aspect-square w-full bg-card rounded-none overflow-hidden border-8 border-border shadow-2xl">
            {isScanning ? (
               <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <Loader2 className="w-20 h-20 text-primary animate-spin" />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Syncing...</h3>
              </div>
            ) : error ? (
               <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <AlertCircle className="w-20 h-20 text-primary" />
                  <h3 className="text-2xl font-black uppercase italic text-primary tracking-tight">Signal Failure</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground max-w-[200px]">
                    Manual override required. Reset camera handshake in terminal settings.
                  </p>
                  <Button variant="outline" className="rounded-none font-black uppercase text-xs border-2 mt-4" onClick={() => window.location.reload()}>Retry Link</Button>
              </div>
            ) : (
               <BarcodeScanner 
                onUpdate={handleScan} 
                onError={handleCameraError} 
                width="100%" 
                height="100%" 
                facingMode="environment" 
                torch={false} 
                videoStyle={{ objectFit: 'cover' }} 
               />
            )}
            
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4/5 h-4/5 border-2 border-primary/20 relative">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-primary"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-primary"></div>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/80 shadow-[0_0_30px_rgba(225,29,72,0.9)] animate-[scan_3s_infinite_linear]"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 text-center">
          <Button variant="ghost" className="w-full text-muted-foreground uppercase font-black italic text-xs tracking-[0.3em] hover:text-primary transition-colors" onClick={() => router.push('/')}>
            ABORT HANDSHAKE
          </Button>
        </div>
      </div>

      <style jsx>{` @keyframes scan { 0% { top: 10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 90%; opacity: 0; } } `}</style>
    </div>
  );
}
