'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Phone, CheckCircle2 } from 'lucide-react';
import type { Agent } from '@/lib/agents';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgentCardProps {
  agent: Agent;
  onCall: (agent: Agent) => void;
  isCalling: boolean;
}

export function AgentCard({ agent, onCall, isCalling }: AgentCardProps) {
  const avatarImage = PlaceHolderImages.find((img) => img.id === agent.avatar);

  return (
    <Card className="flex flex-col border-2 border-border bg-card rounded-none transition-all hover:border-primary">
      <CardHeader className="flex-row items-center gap-4 bg-secondary/5 border-b border-border">
        <Avatar className="h-16 w-16 rounded-none border-2 border-primary">
          {avatarImage && (
            <AvatarImage
              src={avatarImage.imageUrl}
              alt={agent.name}
              data-ai-hint={avatarImage.imageHint}
            />
          )}
          <AvatarFallback className="rounded-none font-black italic">{agent.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow min-w-0">
          <CardTitle className="text-lg font-black uppercase italic tracking-tight truncate">{agent.name}</CardTitle>
          <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground truncate">
            ID: {agent.elevenLabsId.slice(0, 12)}...
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-6 space-y-4">
        <p className="text-xs font-medium text-foreground/80 leading-relaxed line-clamp-3">{agent.description}</p>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol Capabilities</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools.map((tool) => (
              <div key={tool} className="flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 border border-primary/10">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span className="uppercase">{tool.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/5 pt-6 mt-auto">
        <Button
          onClick={() => onCall(agent)}
          disabled={isCalling}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-12"
        >
          <Phone className="mr-2 h-4 w-4" />
          Dispatch Session
        </Button>
      </CardFooter>
    </Card>
  );
}
