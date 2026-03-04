'use client';

import { useEffect, useState } from 'react';
import type { Agent } from '@/lib/agents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneOff, Terminal, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { AudioVisualizer } from './audio-visualizer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CallPanelProps {
  agent: Agent | null;
  status: string;
  duration: number;
  onEndCall: () => void;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const statusColorMap: { [key: string]: string } = {
  connecting: 'text-yellow-500',
  connected: 'text-green-600',
  disconnecting: 'text-destructive',
  disconnected: 'text-muted-foreground',
};

export function CallPanel({
  agent,
  status,
  duration,
  onEndCall,
}: CallPanelProps) {
  const [logs, setLogs] = useState<{ id: string; msg: string; type: 'tool' | 'system' }[]>([]);

  useEffect(() => {
    if (status === 'connected' && agent) {
      setLogs([{ id: 'init', msg: 'Tactical voice link secured.', type: 'system' }]);
      const interval = setInterval(() => {
        const randomTool = agent.tools[Math.floor(Math.random() * agent.tools.length)];
        const newLog = {
          id: Math.random().toString(36),
          msg: `Executing protocol: [${randomTool.toUpperCase()}]`,
          type: 'tool' as const,
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 15));
      }, 4000);
      return () => clearInterval(interval);
    } else if (status === 'disconnected') {
      setLogs([]);
    }
  }, [status, agent]);

  if (!agent) return null;

  return (
    <Card className="mx-auto w-full max-w-4xl border-2 border-border bg-card rounded-none shadow-2xl">
      <CardHeader className="bg-secondary/5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("h-3 w-3 rounded-none rotate-45 animate-pulse", status === 'connected' ? 'bg-green-500' : 'bg-yellow-500')} />
            <CardTitle className="font-headline text-xl font-black uppercase italic tracking-tight">
              Active Dispatch: <span className="text-primary">{agent.name}</span>
            </CardTitle>
          </div>
          <Badge variant="outline" className={cn("rounded-none font-black uppercase text-[10px] tracking-widest border-border", statusColorMap[status])}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/5 p-4 border border-border flex flex-col items-center justify-center text-center">
            <Cpu className="h-5 w-5 text-primary mb-2" />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Agent Core</span>
            <span className="text-[10px] font-bold font-mono truncate w-full">{agent.elevenLabsId}</span>
          </div>
          <div className="bg-secondary/5 p-4 border border-border flex flex-col items-center justify-center text-center">
            <Activity className="h-5 w-5 text-green-600 mb-2" />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Protocol</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Voice-Optimized</span>
          </div>
          <div className="bg-secondary/5 p-4 border border-border flex flex-col items-center justify-center text-center">
            <ShieldCheck className="h-5 w-5 text-blue-600 mb-2" />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Duration</span>
            <span className="text-xl font-black italic text-foreground">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="relative group">
          <AudioVisualizer isAnimating={status === 'connected'} />
          {status === 'connecting' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <span className="text-primary font-black uppercase italic animate-pulse">Establishing Voice Link...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Terminal className="h-4 w-4" /> Available Protocols
            </h3>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map((tool) => (
                <Badge key={tool} variant="secondary" className="rounded-none bg-primary/5 text-primary border-primary/10 px-2 py-0.5 text-[9px] font-black uppercase italic">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4" /> Protocol Execution Log
            </h3>
            <ScrollArea className="h-[120px] w-full border border-border bg-secondary/5 p-4">
              {logs.length === 0 ? (
                <p className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest">Listening for activity...</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className={cn("text-[10px] font-mono animate-in fade-in slide-in-from-left-2", log.type === 'system' ? 'text-blue-600' : 'text-green-600')}>
                      <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      <span className="uppercase font-black mr-1">{log.type === 'system' ? 'SYS:' : 'PROC:'}</span>
                      {log.msg}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-border">
          <Button
            size="lg"
            variant="destructive"
            className="h-16 px-12 rounded-none font-black uppercase italic tracking-widest shadow-xl hover:scale-105 transition-transform"
            onClick={onEndCall}
          >
            <PhoneOff className="mr-2 h-6 w-6" />
            Terminate Dispatch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
