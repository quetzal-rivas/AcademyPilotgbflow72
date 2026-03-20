
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Globe, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  Layout,
  MousePointer2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { slugify } from '@/lib/utils';
import Link from 'next/link';

export default function LandingPageManager() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [isSaving, startTransition] = useTransition();
  
  const [branchName, setBranchName] = useState('');
  const [slug, setSlug] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // Retrieve existing configuration if any
  const userLandingPageRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'user_profiles', user.uid, 'landing_page', 'config');
  }, [db, user]);
  
  const { data: config, isLoading } = useDoc(userLandingPageRef);

  useEffect(() => {
    if (config) {
      setBranchName(config.branchName || '');
      setSlug(config.slug || '');
      setIsPublic(config.isPublic || false);
    }
  }, [config]);

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
  };

  const handleDeploy = () => {
    if (!branchName || !slug || !user || !db) {
      toast({ variant: "destructive", title: "Incomplete Parameters", description: "Branch name and slug are required for deployment." });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          userId: user.uid,
          branchName,
          slug,
          isPublic,
          updatedAt: new Date().toISOString(),
        };

        // 1. Save user-specific config
        await setDoc(doc(db, 'user_profiles', user.uid, 'landing_page', 'config'), payload, { merge: true });

        // 2. Deploy to public registry matrix
        await setDoc(doc(db, 'landing_pages', slug), payload, { merge: true });

        toast({ title: "MISSION DEPLOYED", description: `Landing page is now ${isPublic ? 'LIVE' : 'SECURED'} at /${slug}` });
      } catch (error: any) {
        toast({ variant: "destructive", title: "DEPLOYMENT FAILURE", description: error.message });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/${slug}` : `/${slug}`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="border-l-4 border-primary pl-6">
        <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">Landing Generation</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Intelligence: Deploying Branch-Specific Operational Environments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-none border-2 border-border bg-card shadow-md overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="bg-secondary/5 border-b-2 border-border p-8">
              <CardTitle className="font-headline text-2xl font-black uppercase italic tracking-tighter">Operational Parameters</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Customize your branch's tactical link</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-background/50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Branch Tactical Name</Label>
                  <Input 
                    placeholder="e.g. WEST COVINA" 
                    value={branchName} 
                    onChange={e => setBranchName(e.target.value.toUpperCase())}
                    className="rounded-none border-2 h-12 font-black italic uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">URL Matrix Slug</Label>
                  <div className="flex gap-2">
                    <div className="bg-muted border-2 border-r-0 border-border px-4 flex items-center text-[10px] font-bold opacity-50">/</div>
                    <Input 
                      placeholder="west-covina" 
                      value={slug} 
                      onChange={e => handleSlugChange(e.target.value)}
                      className="rounded-none border-2 h-12 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between p-6 border-2 border-border bg-secondary/5">
                <div className="space-y-1">
                  <p className="font-black uppercase italic text-sm">Public Visibility Matrix</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Toggle live mission status in the theater of operations</p>
                </div>
                <Switch 
                  checked={isPublic} 
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/5 border-t-2 border-border p-6">
              <Button 
                onClick={handleDeploy} 
                disabled={isSaving || !branchName || !slug}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-14 shadow-xl"
              >
                {isSaving ? <Loader2 className="animate-spin mr-3" /> : <Zap className="mr-3" />}
                DEPLOY TACTICAL LANDING
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-2 border-border bg-card shadow-sm">
            <CardHeader className="bg-secondary/5 border-b-2 border-border py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] italic text-primary flex items-center gap-2">
                <Layout className="h-4 w-4" /> Template Core
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="aspect-video bg-muted border-2 border-border relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Badge className="bg-primary text-white font-black italic rounded-none uppercase text-[8px]">PRIMARY ALPHA</Badge>
                </div>
                <div className="p-2 space-y-1">
                  <div className="h-1 w-1/3 bg-primary" />
                  <div className="h-4 w-full bg-border" />
                  <div className="h-2 w-2/3 bg-border" />
                  <div className="grid grid-cols-2 gap-1 pt-2">
                    <div className="h-8 bg-muted border border-border" />
                    <div className="h-8 bg-muted border border-border" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">
                Currently using the <span className="text-primary font-black italic">GRACIE BARRA AI PRIMARY</span> blueprint. Automated photo injection enabled.
              </p>
            </CardContent>
          </Card>

          {slug && (
            <Card className="rounded-none border-2 border-primary bg-primary/5 shadow-md animate-in zoom-in-95">
              <CardHeader className="py-4 border-b border-primary/20">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Secure Link
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Mission URL</Label>
                  <Input readOnly value={publicUrl} className="bg-background border-border text-[10px] font-mono rounded-none h-10" />
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-10 text-[9px]">
                  <Link href={`/${slug}`} target="_blank">
                    INSPECT LIVE ENVIRONMENT <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
