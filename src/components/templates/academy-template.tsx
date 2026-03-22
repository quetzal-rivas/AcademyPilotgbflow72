"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FreeTrialDialog } from '@/components/landing/free-trial-dialog';
import Marquee from '@/components/landing/Marquee';
import { ScrollRevealImage } from '@/components/landing/scroll-reveal-image';
import { BackgroundPhotoRotation } from '@/components/landing/background-photo-rotation';
import { AuthModal } from '@/components/auth/auth-modal';
import { 
  Trophy, 
  Shield, 
  ArrowRight, 
  History, 
  UserCircle
} from 'lucide-react';
import { PhotoGrid } from '@/components/photo-grid';

interface AcademyTemplateProps {
  slug: string;
  branchName: string;
  headline?: string;
  subheadline?: string;
  callToAction?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  heroImage?: string;
  photos: string[];
}

export function AcademyTemplate({ 
  slug,
  branchName, 
  headline,
  subheadline,
  callToAction,
  contactPhone,
  contactEmail,
  address,
  heroImage,
  photos 
}: AcademyTemplateProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background/20 backdrop-blur-xl border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <img 
                src="https://graciebarra.com/wp-content/uploads/2025/07/logos-barra-shield.svg" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-headline text-2xl font-black uppercase italic text-primary">GB {branchName.toUpperCase()}</span>
              <span className="font-headline text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">Official Branch</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AuthModal 
              mode="student" 
              trigger={
                <Button variant="outline" className="hidden sm:inline-flex font-black uppercase tracking-widest text-[10px] border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-none h-10 px-6">
                  <UserCircle className="mr-2 h-4 w-4" /> Student Portal
                </Button>
              } 
            />
            {/* The FreeTrialDialog needs to know WHICH tenant it belongs to */}
            <FreeTrialDialog tenantSlug={slug}>
              <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest px-8 rounded-none h-10">
                Free Trial
              </Button>
            </FreeTrialDialog>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
          {/* Use the specific hero image if provided, otherwise fallback to the photo grid */}
          {heroImage ? (
            <div className="absolute inset-0 z-0">
               <img src={heroImage} alt={`${branchName} Hero`} className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
          ) : (
            <PhotoGrid photoUrls={photos} />
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-block bg-primary px-4 py-1 text-white text-[10px] font-black uppercase tracking-[0.3em] italic">
                {branchName} Tactical Unit Deployed
              </div>
              <h1 className="font-headline text-6xl md:text-8xl font-black leading-none uppercase italic text-white tracking-tighter">
                {headline ? (
                  // Simple split to try and highlight the last word if it's a custom headline
                  <>
                    {headline.split(' ').slice(0, -1).join(' ')} <br />
                    <span className="text-primary">{headline.split(' ').slice(-1)}</span>
                  </>
                ) : (
                  <>Jiu-Jitsu <br /> For <span className="text-primary">Everyone</span></>
                )}
              </h1>
              <p className="text-xl text-white/80 max-w-lg font-bold uppercase italic tracking-tight leading-relaxed">
                {subheadline || `Join ${branchName}, part of the largest and most successful Brazilian Jiu-Jitsu team in the world. Master the art today.`}
              </p>
              
              <FreeTrialDialog tenantSlug={slug}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 py-8 text-lg font-black uppercase italic tracking-widest rounded-none h-auto shadow-2xl">
                  {callToAction || 'START YOUR MISSION'} <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </FreeTrialDialog>
            </div>
          </div>
        </section>

        <Marquee variant="black" />

        <section id="programs" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="space-y-4 border-l-8 border-primary pl-8">
                <h2 className="font-headline text-xs font-black uppercase tracking-[0.4em] text-primary">Operational Matrix</h2>
                <h3 className="font-headline text-6xl font-black uppercase tracking-tighter italic text-black leading-none">{branchName} Programs</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-0 border-4 border-black">
              <ProgramCard title="GB1 Fundamentals" desc="The foundation of our mission." />
              <ProgramCard title="GB2 Advanced" desc="Advanced tactical development." featured />
              <ProgramCard title="Little Champions" desc="Future legacy initialization." />
            </div>
          </div>
        </section>

        <Marquee variant="red" />

        <section className="py-32 bg-secondary text-white relative overflow-hidden min-h-[600px] flex items-center border-y-4 border-border">
          <BackgroundPhotoRotation photoUrls={photos} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl space-y-8 text-left">
              <div className="space-y-4">
                <Badge className="bg-primary text-white font-black uppercase italic tracking-widest rounded-none px-4 border border-white/20">Establish Presence</Badge>
                <h2 className="font-headline text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                  Join the <br />
                  <span className="text-primary">{branchName} Team</span>
                </h2>
              </div>
              <FreeTrialDialog tenantSlug={slug}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full font-black uppercase italic tracking-tighter w-36 h-36 flex flex-col items-center justify-center text-center leading-none shadow-2xl border-4 border-white/10 transition-transform hover:scale-110">
                  FREE<br/>TRIAL
                </Button>
              </FreeTrialDialog>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white border-t-4 border-primary py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="relative w-8 h-8">
              <img 
                src="https://graciebarra.com/wp-content/uploads/2025/07/logos-barra-shield.svg" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-headline text-2xl font-black tracking-tighter uppercase italic">GB {branchName.toUpperCase()}</span>
          </div>
          
          {/* Display contact info if available */}
          {(contactPhone || contactEmail || address) && (
             <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold text-white/60">
                {address && <p>{address}</p>}
                <div className="flex gap-4">
                  {contactPhone && <p>{contactPhone}</p>}
                  {contactEmail && <p>{contactEmail}</p>}
                </div>
             </div>
          )}

          <div className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">
            © 2024 GRACIE BARRA AI PILOT SYSTEM // SECTOR: {branchName.toUpperCase()}
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProgramCard({ title, desc, featured = false }: { title: string, desc: string, featured?: boolean }) {
  return (
    <div className={`p-10 space-y-6 flex flex-col transition-all duration-300 border-r-2 last:border-r-0 border-black ${featured ? 'bg-secondary text-white scale-105 z-10 shadow-2xl' : 'bg-white text-black hover:bg-muted'}`}>
      <h4 className="font-headline text-3xl font-black uppercase italic tracking-tighter leading-none">{title}</h4>
      <p className={`text-sm font-bold uppercase tracking-tight leading-relaxed ${featured ? 'text-white/80' : 'text-muted-foreground'}`}>{desc}</p>
      <div className="mt-auto pt-8">
        <Button variant={featured ? 'default' : 'outline'} className={`w-full font-black uppercase italic tracking-widest rounded-none h-14 text-xs transition-all ${featured ? 'bg-primary hover:bg-primary/90 border-primary text-white' : 'border-black hover:bg-black hover:text-white bg-transparent'}`}>
          DEPLOY UNIT
        </Button>
      </div>
    </div>
  );
}