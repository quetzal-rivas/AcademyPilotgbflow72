"use client";

import { useState, useTransition } from 'react';
import { MessageCircle, Bot, User, Send, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLeadInfo } from '@/ai/flows/global-chat-ai-assistant';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = async () => {
    if (!question.trim() || !leadId.trim()) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');

    startTransition(async () => {
      try {
        const result = await getLeadInfo({ leadId, question: userMessage.text });
        const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: result.answer };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Tactical link failed. Please retry connection.',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-none h-14 w-14 shadow-2xl border-2 border-primary bg-background hover:bg-primary hover:text-white transition-all z-50"
          aria-label="Open Global Chat"
        >
          <Zap className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[70vh] flex flex-col p-0 rounded-none border-2 border-border shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-secondary/5 border-b border-border">
          <DialogTitle className="font-headline text-2xl font-black uppercase italic tracking-tighter">AI Tactical Assistant</DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Review Lead Database & Commercial Strategies
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden px-6">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end space-x-2 ${
                    msg.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <Avatar className="h-8 w-8 rounded-none border border-primary">
                      <AvatarFallback className="rounded-none bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-none border px-4 py-2 text-sm font-medium ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white border-primary italic'
                        : 'bg-secondary/5 border-border'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                     <Avatar className="h-8 w-8 rounded-none border border-foreground">
                      <AvatarFallback className="rounded-none"><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-center space-x-2">
                   <Avatar className="h-8 w-8 rounded-none border border-primary">
                      <AvatarFallback className="rounded-none"><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                    </Avatar>
                  <div className="rounded-none border border-border bg-secondary/5 px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="p-6 pt-4 border-t border-border bg-secondary/5">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Lead ID (e.g., lead-001)"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="flex-1 rounded-none border-2 text-[10px] font-bold uppercase tracking-widest"
                disabled={isPending}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type tactical query..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isPending && handleSendMessage()}
                className="flex-1 rounded-none border-2 font-medium"
                disabled={isPending}
              />
              <Button onClick={handleSendMessage} disabled={isPending || !question.trim() || !leadId.trim()} size="icon" className="rounded-none bg-primary hover:bg-primary/90">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
