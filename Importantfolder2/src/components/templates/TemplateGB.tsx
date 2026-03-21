
'use client';

import React, { useState } from 'react';
import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Clock, Mail, ShieldCheck, Trophy, Users, Loader2 } from "lucide-react";
import { useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function TemplateGB(props: LandingPageData) {
  const { companyInfo, generatedContent, offerings, media, slug } = props;
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroImage = media?.coverImage || 'https://picsum.photos/seed/gb-hero/1200/800';

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const leadData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      createdAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp(),
    };

    try {
      const leadsRef = collection(db, 'landingPages', slug, 'leads');
      await addDocumentNonBlocking(leadsRef, leadData);
      
      toast({
        title: "Registration Successful!",
        description: "An instructor will contact you shortly for your free intro class.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-600/30">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-xl">GB</div>
             <span className="font-headline font-bold text-xl tracking-tighter uppercase">{companyInfo.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#about" className="hover:text-red-500 transition-colors">Academy</a>
            <a href="#programs" className="hover:text-red-500 transition-colors">Programs</a>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6">Free Intro Class</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20">
        <Image 
          src={heroImage} 
          alt="Jiu Jitsu Hero" 
          fill 
          className="object-cover opacity-40"
          priority
          data-ai-hint="martial arts training"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 bg-red-600 text-xs font-bold uppercase tracking-[0.3em] rounded">Organized Jiu-Jitsu</div>
            <h1 className="text-5xl md:text-7xl font-headline font-black leading-[0.9] uppercase italic">
              {generatedContent?.headline || "Jiu-Jitsu for Everyone"}
            </h1>
            <p className="text-xl text-gray-300 max-w-lg leading-relaxed border-l-4 border-red-600 pl-6">
              {generatedContent?.body || "Master the art of Brazilian Jiu-Jitsu in a world-class environment designed for growth, discipline, and community."}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 h-14 px-10 text-lg font-bold">START TODAY</Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 h-14 px-10 text-lg font-bold">OUR SCHEDULE</Button>
            </div>
          </div>

          {/* Lead Capture Form - The Multi-tenant Attribution Engine */}
          <Card className="bg-white text-black p-8 shadow-2xl border-t-8 border-red-600 self-center">
            <h3 className="text-2xl font-headline font-bold mb-2">CLAIM YOUR FREE CLASS</h3>
            <p className="text-sm text-gray-600 mb-6">Enter your details below and start your journey with us.</p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <Input name="name" placeholder="Full Name" required className="bg-gray-50 border-gray-200 h-12" />
              <Input name="email" type="email" placeholder="Email Address" required className="bg-gray-50 border-gray-200 h-12" />
              <Input name="phone" placeholder="Phone Number" required className="bg-gray-50 border-gray-200 h-12" />
              <Textarea name="message" placeholder="Which program are you interested in?" className="bg-gray-50 border-gray-200" rows={3} />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 h-14 font-bold text-lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "GET MY FREE PASS"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-red-600" />
            <h4 className="text-xl font-bold uppercase italic">Family Environment</h4>
            <p className="text-gray-400">A clean, safe, and friendly environment for students of all ages and skill levels.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Trophy className="w-12 h-12 text-red-600" />
            <h4 className="text-xl font-bold uppercase italic">World-Class Instructors</h4>
            <p className="text-gray-400">Learn directly from certified black belts who are dedicated to your success on and off the mats.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Users className="w-12 h-12 text-red-600" />
            <h4 className="text-xl font-bold uppercase italic">Global Community</h4>
            <p className="text-gray-400">Access over 900 Gracie Barra schools worldwide with your single membership.</p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
               <h2 className="text-4xl font-headline font-black uppercase italic">Our Programs</h2>
               <div className="w-20 h-1.5 bg-red-600" />
            </div>
            <p className="text-gray-400 max-w-md hidden md:block">We offer structured classes tailored for adults, children, and professional athletes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((program, i) => (
              <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
                 {program.image ? (
                   <Image src={program.image} alt={program.name} fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                 ) : (
                   <div className="w-full h-full bg-gray-800" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                 <div className="absolute bottom-0 p-8 space-y-2">
                    <h3 className="text-2xl font-bold uppercase italic">{program.name}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">{program.description}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold">GB</div>
               <span className="font-headline font-bold text-lg uppercase">{companyInfo.name}</span>
             </div>
             <p className="text-gray-500 max-w-sm">{companyInfo.description}</p>
             <div className="flex gap-8 text-sm uppercase font-bold text-gray-400">
               <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-600" /> {companyInfo.phone}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-600" /> {companyInfo.hours}</div>
             </div>
          </div>
          <div className="flex flex-col md:items-end justify-center">
             <p className="text-gray-600 text-sm">© {new Date().getFullYear()} GRACIE BARRA INC. ALL RIGHTS RESERVED.</p>
             <div className="mt-4 flex gap-4">
                {companyInfo.socialLinks.map((link, i) => (
                   <a key={i} href={link} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <Mail className="w-4 h-4" />
                   </a>
                ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
