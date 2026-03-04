"use client";

import { useEffect, useState, useTransition, useRef } from 'react';
import { generateLeadReport } from '@/ai/flows/generate-lead-report-flow';
import { Loader2, AlertTriangle, Wand2, Volume2, StopCircle } from 'lucide-react';

interface LeadHoverSummaryProps {
  lead: {
    name: string;
    email: string;
    status: string;
    source: string;
    date: string;
  };
}

export function LeadHoverSummary({ lead }: LeadHoverSummaryProps) {
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!report && !isGenerating && !error) {
      startTransition(async () => {
        try {
          const result = await generateLeadReport({
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source,
            capturedDate: lead.date,
          });
          setReport(result.report);
        } catch (err: any) {
          setError("Report unavailable.");
        }
      });
    }
  }, [lead]);

  const handleToggleSpeech = async () => {
    if (!report) return;
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: report }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.play();
      setIsSpeaking(true);
      audioRef.current.onended = () => setIsSpeaking(false);
    } catch (err) {
      setError("Audio failed.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="p-4 space-y-3 max-w-sm min-w-[250px] relative bg-background border-2 border-border shadow-2xl">
      {report && (
        <button
          onClick={handleToggleSpeech}
          disabled={isLoadingAudio}
          className="absolute top-3 right-3 text-primary hover:scale-110 transition-transform"
        >
          {isLoadingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      <h4 className="font-headline text-xs font-black uppercase italic flex items-center text-primary pr-8">
        <Wand2 className="w-3 h-3 mr-2" />
        AI Tactical Briefing
      </h4>
      
      {isGenerating && !report && (
        <div className="flex items-center text-muted-foreground text-[10px] font-bold uppercase py-2">
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Analyzing Lead...
        </div>
      )}
      
      {report && (
        <p className="text-xs font-medium text-foreground whitespace-pre-wrap border-t border-border pt-3 mt-2 italic leading-relaxed">
          "{report}"
        </p>
      )}
      
      {error && <p className="text-[10px] text-primary font-bold uppercase">{error}</p>}
    </div>
  );
}
