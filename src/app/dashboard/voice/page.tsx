'use client';

import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { AgentRoster } from '@/components/voice/agent-roster';
import { CallPanel } from '@/components/voice/call-panel';
import { agents, type Agent } from '@/lib/agents';
import { Mic, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VoiceDispatchPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onError: (error) => {
      console.error('ElevenLabs Error:', error);
      toast({
        variant: 'destructive',
        title: 'Call Error',
        description: 'Failed to establish connection with the agent dispatch.',
      });
    },
    onMessage: (message) => {
      console.log('Message from ElevenLabs:', message);
    },
  });

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (conversation.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [conversation.status]);

  const handleInitiateCall = useCallback(async (agent: Agent) => {
    try {
      setSelectedAgent(agent);
      // Ensure microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: agent.elevenLabsId,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Microphone access is required to initiate tactical dispatch.',
      });
      setSelectedAgent(null);
    }
  }, [conversation, toast]);

  const handleEndCall = useCallback(async () => {
    await conversation.endSession();
    setSelectedAgent(null);
  }, [conversation]);

  return (
    <div className="space-y-12">
      <div className="border-l-4 border-primary pl-6">
        <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none">Voice Dispatch Center</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Pilot: Real-Time Tactical AI Communication</p>
      </div>

      <Alert className="rounded-none bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Tactical Overview</AlertTitle>
        <AlertDescription className="text-xs font-medium text-muted-foreground">
          Dispatch AI agents to handle lead qualification, membership inquiries, or strategic briefings. 
          Powered by ElevenLabs for high-fidelity conversational intelligence.
        </AlertDescription>
      </Alert>

      <div
        className="transition-all duration-500 ease-in-out"
        style={{
          opacity: selectedAgent ? 0 : 1,
          pointerEvents: selectedAgent ? 'none' : 'auto',
          transform: selectedAgent ? 'translateY(-20px)' : 'translateY(0)',
          display: selectedAgent && conversation.status !== 'disconnected' ? 'none' : 'block',
        }}
      >
        <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" /> Available Tactical Units
        </h2>
        <AgentRoster
          agents={agents}
          onCall={handleInitiateCall}
          isCalling={conversation.status !== 'disconnected'}
        />
      </div>

      {selectedAgent && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-grow">
          <CallPanel
            agent={selectedAgent}
            status={conversation.status}
            duration={callDuration}
            onEndCall={handleEndCall}
          />
        </div>
      )}
    </div>
  );
}
