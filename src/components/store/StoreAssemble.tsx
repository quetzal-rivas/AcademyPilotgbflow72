
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function StoreAssemble() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const item1Ref = useRef<HTMLDivElement>(null);
  const item2Ref = useRef<HTMLDivElement>(null);

  const kimonoImg = PlaceHolderImages.find(img => img.id === 'gb-kimono');
  const nogiImg = PlaceHolderImages.find(img => img.id === 'gb-nogi');

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // Extended for individual item focus
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      },
    });

    // 1. MISSION TITLE ASSEMBLY (Starts large/blurry in background, flies forward)
    tl.fromTo(titleRef.current,
      { scale: 0.1, opacity: 0, filter: "blur(20px)", z: -1000 },
      { scale: 1, opacity: 1, filter: "blur(0px)", z: 0, ease: "power2.out", duration: 1 }
    );

    // 2. TITLE DISSOLVE (Flies past the viewer)
    tl.to(titleRef.current, {
      scale: 15,
      opacity: 0,
      z: 1000,
      filter: "blur(40px)",
      ease: "power2.in",
      duration: 1
    }, "+=0.5");

    // 3. ITEM 1: KIMONO ASSEMBLY
    tl.fromTo(item1Ref.current,
      { scale: 0.2, opacity: 0, z: -800, filter: "blur(20px)" },
      { scale: 1, opacity: 1, z: 0, filter: "blur(0px)", ease: "power3.out", duration: 1.2 }
    );

    // 4. ITEM 1: FLY PAST
    tl.to(item1Ref.current, {
      x: -1200,
      rotateY: -45,
      opacity: 0,
      scale: 0.5,
      ease: "power2.in",
      duration: 1
    }, "+=0.8");

    // 5. ITEM 2: NO-GI ASSEMBLY
    tl.fromTo(item2Ref.current,
      { scale: 0.2, opacity: 0, z: -800, filter: "blur(20px)" },
      { scale: 1, opacity: 1, z: 0, filter: "blur(0px)", ease: "power3.out", duration: 1.2 }
    );

  }, { scope: containerRef });

  const buildCheckoutUrl = (name: string, price: string, details: string, imgId: string) => {
    return `/checkout?plan=${encodeURIComponent(name)}&price=${price}&details=${encodeURIComponent(details)}&itemType=uniform&assetId=${imgId}`;
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#002B5B] overflow-hidden flex flex-col items-center justify-center perspective-container">
      {/* Tactical Header Overlay */}
      <div className="absolute top-0 left-0 w-full h-24 border-b-4 border-border bg-black/40 backdrop-blur-xl z-[100] flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10">
            <img 
              src="https://graciebarra.com/wp-content/uploads/2025/07/logos-barra-shield.svg" 
              alt="GB Shield" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-black uppercase italic tracking-tighter text-primary leading-none">ARMORY HUB</span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Equipping the Global Legacy</span>
          </div>
        </div>
        <Button asChild variant="ghost" className="text-white hover:text-primary rounded-none font-black uppercase italic text-xs tracking-widest p-0 h-auto">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> ABORT TO BASE
          </Link>
        </Button>
      </div>

      {/* Cinematic Vignette Shadows */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Background Matrix Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)]" />
        <div className="h-full w-full absolute top-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)]" />
      </div>

      {/* 1. MASTER TITLE SECTION */}
      <div ref={titleRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 will-change-transform perspective-element">
        <h1 className="text-center">
          <span className="block text-[10vw] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            GRACIE BARRA
          </span>
          <span className="block text-[8vw] font-black text-primary uppercase italic tracking-tighter leading-none -mt-4 drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">
            TACTICAL STORE
          </span>
        </h1>
      </div>

      {/* 2. ARMOR UNIT 1: KIMONO */}
      <div ref={item1Ref} className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform perspective-element px-6">
        <Card className="max-w-4xl w-full bg-card/40 backdrop-blur-2xl border-4 border-border rounded-none shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 relative aspect-square md:aspect-auto">
              <Image 
                src={kimonoImg?.imageUrl || "https://picsum.photos/seed/kimono/800/1000"} 
                alt="Kimono" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <ShieldCheck className="text-primary h-5 w-5" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">OFFICIAL COMMAND ISSUE</span>
              </div>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-2 border-l-8 border-primary pl-8">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Operational Gear v1.0</p>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">GB PRO KIMONO</h3>
              </div>
              <p className="text-lg font-bold text-white/60 uppercase tracking-tight leading-relaxed">
                Engineered for maximum durability and tactical mobility. The standard issue uniform for all Gracie Barra units.
              </p>
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">UNIT COST</span>
                  <span className="text-5xl font-black text-white italic">$120.00</span>
                </div>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic h-16 px-10 shadow-xl">
                  <Link href={buildCheckoutUrl("GB Pro Kimono", "120", "Official competition-ready Gracie Barra Kimono. Durable pearl weave with reinforced stitching.", "gb-kimono")}>
                    ACQUIRE UNIT <ShoppingCart className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. ARMOR UNIT 2: NO-GI */}
      <div ref={item2Ref} className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform perspective-element px-6">
        <Card className="max-w-4xl w-full bg-card/40 backdrop-blur-2xl border-4 border-border rounded-none shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 relative aspect-square md:aspect-auto">
              <Image 
                src={nogiImg?.imageUrl || "https://picsum.photos/seed/nogi/800/1000"} 
                alt="No-Gi" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <Zap className="text-primary h-5 w-5" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">TACTICAL STEALTH LAYER</span>
              </div>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-2 border-l-8 border-primary pl-8">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Combat Matrix v2.4</p>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">NO-GI ARMOR</h3>
              </div>
              <p className="text-lg font-bold text-white/60 uppercase tracking-tight leading-relaxed">
                High-compression moisture-wicking tech. Optimized for high-intensity grappling and stealth operations.
              </p>
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">UNIT COST</span>
                  <span className="text-5xl font-black text-white italic">$80.00</span>
                </div>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic h-16 px-10 shadow-xl">
                  <Link href={buildCheckoutUrl("No-Gi Tactical Armor", "80", "Complete No-Gi set including high-compression rashguard and grappling shorts.", "gb-nogi")}>
                    ACQUIRE UNIT <ShoppingCart className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
