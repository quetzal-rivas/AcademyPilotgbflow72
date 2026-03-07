
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";
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
        end: "+=300%",
        pin: true,
        scrub: 1,
      },
    });

    // ASSEMBLY: Title
    tl.fromTo(titleRef.current,
      { scale: 15, opacity: 0, filter: "blur(40px)", z: 800 },
      { scale: 1, opacity: 1, filter: "blur(0px)", z: 0, ease: "power2.inOut" },
      0
    );

    // ASSEMBLY: Kimono
    tl.fromTo(item1Ref.current,
      { scale: 8, x: -800, y: -300, opacity: 0, filter: "blur(30px)" },
      { scale: 1, x: 0, y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out" },
      0.3
    );

    // ASSEMBLY: No Gi
    tl.fromTo(item2Ref.current,
      { scale: 8, x: 800, y: 300, opacity: 0, filter: "blur(30px)" },
      { scale: 1, x: 0, y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out" },
      0.6
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Tactical Header Overlay */}
      <div className="absolute top-0 left-0 w-full h-24 border-b-2 border-border bg-black/40 backdrop-blur-md z-50 flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
          <img 
            src="https://graciebarra.com/wp-content/uploads/2025/07/logos-barra-shield.svg" 
            alt="GB Shield" 
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="font-headline text-xl font-black uppercase italic tracking-tighter text-primary">ARMORY HUB</span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/60">Equipping the Legacy</span>
          </div>
        </div>
        <Button asChild variant="ghost" className="text-white hover:text-primary rounded-none font-black uppercase italic text-xs tracking-widest p-0 h-auto">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> ABORT TO BASE
          </Link>
        </Button>
      </div>

      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.1)_1px,rgba(255,255,255,0.1)_2px)] bg-[length:100%_2px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-6">
        <div ref={titleRef} className="opacity-0 text-center mb-20">
          <h1 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">
            TACTICAL <br /><span className="text-primary drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">EQUIPMENT</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full">
          {/* Kimono Unit */}
          <div ref={item1Ref} className="opacity-0 group">
            <Card className="rounded-none border-4 border-border bg-card/80 backdrop-blur-xl hover:border-primary transition-all duration-500 shadow-2xl overflow-hidden relative">
              <div className="relative aspect-[4/5] w-full">
                <Image 
                  src={kimonoImg?.imageUrl || "https://picsum.photos/seed/kimono/800/1000"} 
                  alt="Kimono" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6 bg-primary text-white font-black italic px-4 py-1 text-[10px] tracking-widest shadow-xl">CERTIFIED GI</div>
              </div>
              <div className="p-8 space-y-6 relative z-10">
                <div className="space-y-2 border-l-4 border-primary pl-6">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">GB PRO-KIMONO</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Standard Issue Uniform Matrix</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-black text-primary italic tracking-tighter">$120.00</span>
                  <Button className="rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest h-14 px-8 shadow-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" /> ACQUIRE UNIT
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* No-Gi Unit */}
          <div ref={item2Ref} className="opacity-0 group">
            <Card className="rounded-none border-4 border-border bg-card/80 backdrop-blur-xl hover:border-primary transition-all duration-500 shadow-2xl overflow-hidden relative">
              <div className="relative aspect-[4/5] w-full">
                <Image 
                  src={nogiImg?.imageUrl || "https://picsum.photos/seed/nogi/800/1000"} 
                  alt="No-Gi" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6 bg-primary text-white font-black italic px-4 py-1 text-[10px] tracking-widest shadow-xl">ELITE NO-GI</div>
              </div>
              <div className="p-8 space-y-6 relative z-10">
                <div className="space-y-2 border-l-4 border-primary pl-6">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">NO-GI ARMOR V2</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">High-Performance Rashguard Set</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-black text-primary italic tracking-tighter">$80.00</span>
                  <Button className="rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest h-14 px-8 shadow-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" /> ACQUIRE UNIT
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Side Vignettes */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-black via-transparent to-black opacity-90" />
    </section>
  );
}
