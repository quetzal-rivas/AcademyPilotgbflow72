
"use client";

import { Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClassQueueProps {
  attendees: string[];
}

export function ClassQueue({ attendees }: ClassQueueProps) {
  return (
    <div className="mt-12 bg-card border-4 border-border rounded-none p-8 w-full max-w-md shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 font-black uppercase italic tracking-widest text-sm">
          <Users className="w-5 h-5 text-primary" />
          <span>Active Registry</span>
        </div>
        <Badge className="bg-primary text-white font-black italic rounded-none px-4 py-1">
          {attendees.length} PRESENT
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {attendees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic font-bold uppercase tracking-widest text-[10px] opacity-40">
              Awaiting student deployment...
            </div>
          ) : (
            attendees.map((name, i) => (
              <div 
                key={`${name}-${i}`} 
                className="flex items-center justify-between bg-secondary/5 p-4 border-2 border-border group hover:border-primary transition-all animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic text-white text-xs rotate-45">
                    <span className="-rotate-45">{name.charAt(0)}</span>
                  </div>
                  <span className="font-black uppercase italic text-sm">{name}</span>
                </div>
                <Zap className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
