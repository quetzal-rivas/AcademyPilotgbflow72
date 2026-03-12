"use client";

import { useState } from "react";
import { interpretTaxRulesAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, Send, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, BrainCircuit, Download } from "lucide-react";

export default function AITaxAdvisoryPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ explanation: string, keyConsiderations: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await interpretTaxRulesAction({ query });
      setResult(response);
    } catch (err) {
      setError("Tactical processing failure. Operational data corrupted. Retry link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-primary pl-6">
        <div className="space-y-1">
          <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground flex items-center gap-4">
            <BrainCircuit className="h-10 w-10 text-primary" /> Tax Insight Engine
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">
            Intelligence: AI Interpretation of IRS & CA State Matrix
          </p>
        </div>
        <Badge className="bg-primary text-white font-black italic uppercase tracking-widest px-4 py-1.5 rounded-none shadow-lg text-[10px]">
          POWERED BY GEMINI 2.0 FLASH
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-none border-2 border-border bg-card shadow-md">
            <CardHeader className="bg-secondary/5 border-b-2 border-border">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] italic text-primary">Protocol Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Focus Sectors</p>
                <div className="space-y-1.5">
                  {['IRS 1099-NEC', 'CA Sales Tax', 'W-8BEN-E Handshake', 'Economic Nexus'].map(s => (
                    <div key={s} className="flex items-center gap-2 text-[10px] font-bold uppercase italic text-foreground">
                      <div className="h-1.5 w-1.5 bg-primary rotate-45" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="p-4 bg-primary/5 border border-primary/20">
                <p className="text-[9px] font-black uppercase italic text-primary mb-1">Resource Cost</p>
                <p className="text-[10px] font-bold text-muted-foreground">1 Intelligence Unit per Matrix Analysis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-10">
          <Card className="rounded-none border-2 border-border bg-card shadow-md overflow-hidden group hover:border-primary transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="bg-secondary/5 border-b-2 border-border p-8">
              <CardTitle className="font-headline text-2xl font-black uppercase italic tracking-tighter">Strategic Query Entry</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Submit accounting inquiries for AI interpretation</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea 
                  placeholder="e.g. Explain California sales tax rules for digital service providers hiring out-of-state contractors under 1099-NEC..."
                  className="min-h-[150px] resize-none rounded-none border-2 border-border bg-background focus-visible:ring-primary text-base font-medium italic p-6"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  disabled={isLoading || !query.trim()} 
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-[0.2em] text-sm shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" /> ANALYZING TAX MATRIX...
                    </>
                  ) : (
                    <>
                      COMMENCE ANALYSIS <Send className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <div className="p-6 bg-destructive/10 border-2 border-destructive/20 text-destructive rounded-none flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert className="h-6 w-6 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Protocol Interrupted</p>
                <p className="text-sm font-bold italic mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <Card className="rounded-none border-4 border-primary bg-primary/5 shadow-2xl relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Sparkles size={120} />
                 </div>
                 <CardHeader className="bg-primary text-white border-b-2 border-white/10 p-8">
                   <CardTitle className="font-headline text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                     <Sparkles className="h-8 w-8" /> Intelligence Briefing
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-10 space-y-10">
                   <div className="prose prose-invert max-w-none">
                     <p className="text-xl text-foreground font-bold italic leading-relaxed bg-white/5 border-l-8 border-primary p-8 shadow-inner">
                       {result.explanation}
                     </p>
                   </div>

                   <div className="space-y-6">
                     <h4 className="font-black text-primary uppercase tracking-[0.3em] text-xs flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5" /> TACTICAL CONSIDERATIONS
                     </h4>
                     <div className="grid sm:grid-cols-2 gap-6">
                       {result.keyConsiderations.map((item, idx) => (
                         <div key={idx} className="p-6 bg-secondary/10 border-2 border-border hover:border-primary transition-all rounded-none flex items-start gap-4 group">
                           <div className="h-2 w-2 bg-primary rotate-45 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                           <span className="text-sm font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{item}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </CardContent>
                 <CardFooter className="bg-secondary/5 border-t border-border p-6 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">Generated by GracieFlow AI v2.5 // Registry Link Active</span>
                    <Button variant="ghost" size="sm" className="font-black uppercase italic text-[10px] tracking-widest text-primary hover:bg-primary/10 rounded-none h-10 px-6 gap-2">
                      <Download className="h-4 w-4" /> Export Briefing
                    </Button>
                 </CardFooter>
               </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
