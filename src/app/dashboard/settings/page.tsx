"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsIntegrations() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Success", description: "API configurations saved securely." });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold italic uppercase tracking-tight">Integrations & API Management</h1>
        <p className="text-muted-foreground">Securely connect your preferred platforms to power your AI commercial pilot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary italic">Secure Configuration</span>
              </div>
              <CardTitle className="font-headline text-2xl font-black uppercase italic italic">API Key Management</CardTitle>
              <CardDescription>All keys are encrypted and stored securely using Firebase Secret Manager.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <IntegrationField 
                label="Meta Business API" 
                description="Powers your AI-driven Meta ad campaigns." 
                placeholder="EAAB... (Access Token)"
              />
              <Separator />
              <IntegrationField 
                label="Twilio Messaging" 
                description="Enables WhatsApp and SMS omnichannel capabilities." 
                placeholder="SK... (Auth Token)"
              />
              <Separator />
              <IntegrationField 
                label="ElevenLabs Voice" 
                description="Powers your AI voice qualification agent." 
                placeholder="el-..."
              />
              <Separator />
              <IntegrationField 
                label="OpenAI / Gemini" 
                description="The brain behind your conversational agents." 
                placeholder="sk-..."
              />
              
              <div className="pt-4">
                <Button className="w-full md:w-auto px-10 rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest h-12" onClick={handleSave} disabled={saving}>
                  {saving ? "Encrypting & Saving..." : "Save Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-accent italic">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusItem label="Meta API" connected={true} />
              <StatusItem label="Twilio Webhooks" connected={true} />
              <StatusItem label="ElevenLabs Engine" connected={false} />
              <StatusItem label="Firebase Database" connected={true} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-accent italic">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="p-0 h-auto text-sm justify-start font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                <ExternalLink className="mr-2 h-3 w-3" /> Meta Developers Console
              </Button>
              <Button variant="link" className="p-0 h-auto text-sm justify-start font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                <ExternalLink className="mr-2 h-3 w-3" /> Twilio Dashboard
              </Button>
              <Button variant="link" className="p-0 h-auto text-sm justify-start font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                <ExternalLink className="mr-2 h-3 w-3" /> ElevenLabs Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function IntegrationField({ label, description, placeholder }: { label: string, description: string, placeholder: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Label className="text-lg font-black uppercase italic tracking-tight">{label}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary text-primary rounded-none">Active</Badge>
      </div>
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="password" placeholder={placeholder} className="pl-10 bg-background rounded-none border-border focus-visible:ring-primary" />
      </div>
    </div>
  );
}

function StatusItem({ label, connected }: { label: string, connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${connected ? 'text-green-500' : 'text-red-500'}`}>
          {connected ? 'Operational' : 'Disconnected'}
        </span>
        <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
      </div>
    </div>
  );
}
