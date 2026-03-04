
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateVoiceAgentScript, type VoiceAgentScriptGeneratorOutput } from "@/ai/flows/voice-agent-script-generator";
import { Mic, Loader2, Sparkles, PlayCircle, BookOpen, Quote, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VoiceAgentTool() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState("");
  const [script, setScript] = useState<VoiceAgentScriptGeneratorOutput | null>(null);

  const handleGenerateScript = async () => {
    if (!services) {
      toast({ title: "Error", description: "Please provide a description of your services.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await generateVoiceAgentScript({ academyServices: services });
      setScript(result);
      toast({ title: "Script Generated", description: "Your AI voice qualification script is ready." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate voice script.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">AI Voice Agent Pilot</h1>
        <p className="text-muted-foreground">Train your voice agent to handle inbound inquiries and qualify students automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Service Training Data
              </CardTitle>
              <CardDescription>Enter details about your academy programs, pricing, and key qualification criteria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="services">Academy Offerings & Criteria</Label>
                <Textarea 
                  id="services" 
                  className="min-h-[250px] bg-background border-border" 
                  placeholder="e.g. We offer Brazilian Jiu-Jitsu for kids and adults. We only accept students over 6 years old. Trials are free. We need to know if they have previous experience and their availability for afternoon classes..." 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
              </div>
              <Button className="w-full rounded-xl bg-primary h-12" onClick={handleGenerateScript} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Qualification Script
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                <PlayCircle className="h-4 w-4" />
                Preview Agent Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4 italic">Integrated with ElevenLabs API for realistic conversational response.</p>
              <div className="flex items-center gap-4">
                <Button size="sm" variant="outline" className="border-accent text-accent">Listen to Sample</Button>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Voice: Rachel (Commercial)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {script ? (
            <Card className="bg-card border-border shadow-xl animate-in fade-in zoom-in-95">
              <CardHeader className="border-b border-border">
                <CardTitle className="font-headline text-xl">{script.scriptTitle}</CardTitle>
                <CardDescription>Qualified Voice Lead Script</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Introduction</span>
                  <p className="p-4 bg-secondary/30 rounded-xl text-sm italic border border-border">"{script.introduction}"</p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Qualification Flow</span>
                  {script.qualificationQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-3 p-4 border border-border rounded-xl bg-background shadow-sm">
                      <div className="flex gap-3 items-start">
                        <div className="h-6 w-6 bg-accent text-accent-foreground flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-sm font-medium">{q.question}</p>
                      </div>
                      <div className="pl-9 space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-bold text-[10px] uppercase text-accent mr-2">Handling Logic:</span>
                          {q.responseHandling}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {q.expectedResponses.map((res, i) => (
                            <span key={i} className="px-2 py-0.5 bg-secondary text-[10px] rounded-full text-muted-foreground border border-border">
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Closing Statement</span>
                  <p className="p-4 bg-secondary/30 rounded-xl text-sm italic border border-border">"{script.closingStatement}"</p>
                </div>

                {script.disclaimer && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-[10px] leading-tight">{script.disclaimer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-20 text-center opacity-40">
              <Quote className="h-16 w-16 mb-6" />
              <h3 className="font-headline text-xl font-bold">Script Pending</h3>
              <p>Configure your academy services to see your voice agent's qualification strategy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
