"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Shield, ExternalLink, Info, CheckCircle2, ShieldAlert, Landmark } from "lucide-react";

export default function DocumentsPage() {
  const documents = [
    {
      title: "W-8BEN-E Form",
      description: "Certificate of Status of Beneficial Owner for United States Tax Withholding and Reporting. Crucial for Foreign Source Service Fee classification.",
      version: "2023 REVISION",
      type: "Official IRS Form",
      category: "Tax Protocols"
    },
    {
      title: "Tactical Compliance Memo",
      description: "Detailed legal interpretation regarding California service taxes and economic nexus thresholds for martial arts academies.",
      version: "V1.4 ALPHA",
      type: "Internal Advisory",
      category: "Mission Directives"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="border-l-4 border-primary pl-6">
        <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">Compliance Hub</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Sector Sigma: Operational Legal & Regulatory Assets</p>
      </div>

      <div className="grid gap-8">
        {documents.map((doc, idx) => (
          <Card key={idx} className="group hover:border-primary/50 transition-all duration-500 rounded-none border-2 border-border bg-card shadow-md overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-72 bg-secondary/5 flex flex-col items-center justify-center p-10 border-b-2 md:border-b-0 md:border-r-2 border-border group-hover:bg-primary/5 transition-colors">
              <div className="h-20 w-20 bg-background border-4 border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary transition-all rotate-45">
                <FileText className="h-10 w-10 text-primary -rotate-45" />
              </div>
              <Badge className="bg-primary text-white font-black italic uppercase tracking-widest text-[9px] px-4 py-1 rounded-none shadow-lg">{doc.type}</Badge>
            </div>
            <div className="flex-1 p-10 flex flex-col justify-between space-y-8 bg-background/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{doc.title}</h3>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] bg-muted px-3 py-1 rounded-none">{doc.category}</span>
                </div>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">{doc.description}</p>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-primary">
                  <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Verified Asset</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Protocol {doc.version}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-14 px-10 shadow-xl group">
                  <Download className="h-5 w-5 mr-3 transition-transform group-hover:translate-y-1" /> Download Matrix PDF
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-none border-4 border-foreground font-black uppercase italic tracking-widest hover:bg-foreground hover:text-background transition-all">
                  <ExternalLink className="h-5 w-5 mr-3" /> Inspect Protocol
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-4 border-primary bg-primary/5 shadow-2xl relative overflow-hidden">
        <ShieldAlert className="absolute top-0 right-0 h-48 w-48 text-primary opacity-5 rotate-12 -translate-y-16 translate-x-16" />
        <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="bg-primary/10 p-6 border-2 border-primary rotate-45 shrink-0">
            <Landmark className="h-12 w-12 text-primary -rotate-45" />
          </div>
          <div className="space-y-4 text-center md:text-left flex-1">
            <h4 className="font-headline text-3xl font-black uppercase italic tracking-tighter text-primary">Custom Legal Intelligence Needed?</h4>
            <p className="text-base font-bold text-muted-foreground uppercase tracking-tight max-w-2xl leading-relaxed italic">
              Our engineering team can provision academy-specific memos for your firm's unique operational theater. Connect with the Command Legal Desk.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary font-black uppercase italic tracking-widest text-sm hover:underline decoration-2">
              REQUEST CUSTOM BRIEFING →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
