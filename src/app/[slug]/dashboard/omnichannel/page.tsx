
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { initializeOmnichannelAssistant, type OmnichannelAssistantInitializerOutput } from "@/ai/flows/omnichannel-assistant-initializer";
import { MessageSquare, WhatsApp, Smartphone, Loader2, Sparkles, UserCheck, PhoneCall, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OmnichannelConfig() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [academyName, setAcademyName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [offerings, setOfferings] = useState([""]);
  const [channels, setChannels] = useState<string[]>(["WhatsApp", "Messenger"]);
  const [generatedFlow, setGeneratedFlow] = useState<OmnichannelAssistantInitializerOutput | null>(null);

  const handleAddOffering = () => setOfferings([...offerings, ""]);
  const handleOfferingChange = (idx: number, val: string) => {
    const newOfferings = [...offerings];
    newOfferings[idx] = val;
    setOfferings(newOfferings);
  };

  const toggleChannel = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const handleInitialize = async () => {
    if (!academyName || offerings.every(o => o.trim() === "")) {
      toast({ title: "Error", description: "Academy name and offerings are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await initializeOmnichannelAssistant({
        academyName,
        offerings: offerings.filter(o => o.trim() !== ""),
        targetAudience,
        channels: channels as any
      });
      setGeneratedFlow(result);
      toast({ title: "Flow Generated", description: "Conversation strategies have been designed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to initialize assistant flows.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Omnichannel AI Assistant</h1>
        <p className="text-muted-foreground">Set up AI agents that automatically qualify leads on WhatsApp, Messenger, and SMS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-headline">Agent Profile</CardTitle>
            <CardDescription>Define how your automated commercial team operates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="academyName">Academy Name</Label>
              <Input id="academyName" value={academyName} onChange={(e) => setAcademyName(e.target.value)} placeholder="e.g. Zen Martial Arts Hub" />
            </div>

            <div className="space-y-2">
              <Label>Core Offerings</Label>
              {offerings.map((offering, idx) => (
                <Input key={idx} value={offering} onChange={(e) => handleOfferingChange(idx, e.target.value)} placeholder={`Service ${idx + 1}`} className="mb-2" />
              ))}
              <Button variant="link" size="sm" onClick={handleAddOffering} className="p-0 text-accent">Add Offering</Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Audience (Optional)</Label>
              <Input id="target" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Busy professionals in New York" />
            </div>

            <div className="space-y-3">
              <Label>Active Channels</Label>
              <div className="space-y-2">
                {['WhatsApp', 'Messenger', 'SMS'].map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-secondary/30">
                    <Checkbox id={c} checked={channels.includes(c)} onCheckedChange={() => toggleChannel(c)} />
                    <Label htmlFor={c} className="flex items-center gap-2 text-sm cursor-pointer">
                      {c === 'WhatsApp' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {c === 'Messenger' && <Smartphone className="h-4 w-4 text-blue-500" />}
                      {c === 'SMS' && <Smartphone className="h-4 w-4 text-primary" />}
                      {c}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full rounded-xl bg-primary h-12" onClick={handleInitialize} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate AI Strategy
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {generatedFlow ? (
            <Card className="bg-card border-border shadow-xl">
              <CardHeader className="border-b border-border bg-secondary/20">
                <CardTitle className="font-headline text-accent">Generated Commercial Strategy</CardTitle>
                <CardDescription>AI-designed conversation flows for your selected channels.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={channels[0]} className="w-full">
                  <div className="px-6 pt-4">
                    <TabsList className="bg-secondary/50 border border-border">
                      {channels.map(c => (
                        <TabsTrigger key={c} value={c} className="data-[state=active]:bg-primary">
                          {c}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  {channels.map(channel => {
                    const flowKey = (channel.toLowerCase() + 'Flow') as keyof OmnichannelAssistantInitializerOutput;
                    const flow = generatedFlow[flowKey];
                    if (!flow) return null;

                    return (
                      <TabsContent key={channel} value={channel} className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4">
                        <FlowSection title="Initial Greeting" content={flow.initialGreeting} icon={<MessageSquare className="h-4 w-4" />} />
                        <FlowSection title="Qualification Questions" items={flow.qualificationQuestions} icon={<UserCheck className="h-4 w-4" />} />
                        <FlowSection title="Response Examples" items={flow.responseExamples} icon={<Sparkles className="h-4 w-4" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FlowSection title="Lead Capture" content={flow.leadCaptureInstructions} icon={<Smartphone className="h-4 w-4" />} />
                           <FlowSection title="Escalation Path" content={flow.escalationPath} icon={<PhoneCall className="h-4 w-4" />} />
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-20 text-center opacity-40">
              <MessageSquare className="h-16 w-16 mb-6" />
              <h3 className="font-headline text-xl font-bold">No Flows Generated</h3>
              <p>Fill out your academy profile to generate automated conversation flows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlowSection({ title, content, items, icon }: { title: string, content?: string, items?: string[], icon: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded text-primary">{icon}</div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
      </div>
      {content && (
        <div className="p-4 bg-background border border-border rounded-xl relative group">
          <p className="text-sm italic">{content}</p>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}
      {items && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm p-3 bg-background border border-border rounded-xl">
              <span className="text-accent font-bold">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
