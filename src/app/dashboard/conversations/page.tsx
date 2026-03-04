"use client";

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, MessageSquare, Zap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Expanded mock data with chat histories
const LEADS_WITH_HISTORY = [
  { 
    id: "1", 
    name: "Alice Johnson", 
    email: "alice@example.com", 
    status: "New",
    history: [
      { sender: 'customer', text: "Hi, I'm interested in the GB1 Fundamentals program. Do you have classes for adults with no experience?" },
      { sender: 'agent', text: "Oss, Alice! Yes, we do. Our GB1 program is specifically designed for beginners with zero martial arts experience. Would you like to schedule a free trial class?" },
      { sender: 'customer', text: "That sounds great. What should I wear for the first class?" },
      { sender: 'agent', text: "For your first class, we recommend comfortable athletic wear (like a t-shirt and shorts). We will provide a Gi for you to borrow. Does this Tuesday at 6 PM work for you?" }
    ]
  },
  { 
    id: "2", 
    name: "Bob Smith", 
    email: "bob@example.com", 
    status: "Qualified",
    history: [
      { sender: 'customer', text: "Is there a family discount if I join with my two kids?" },
      { sender: 'agent', text: "Absolutely! We promote a family-oriented environment. We have special rates for family memberships. Are you looking to join the kids programs or the adult ones too?" },
      { sender: 'customer', text: "Both. I'd like to train while they are in the Little Champions class." }
    ]
  },
  { 
    id: "4", 
    name: "Diana Prince", 
    email: "diana@example.com", 
    status: "Converted",
    history: [
      { sender: 'customer', text: "I just signed up for the premium membership. When can I pick up my official GB uniform?" },
      { sender: 'agent', text: "Welcome to the team, Diana! You can pick it up at the front desk anytime before your next class. We have your size reserved." }
    ]
  }
];

export default function ConversationsPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(LEADS_WITH_HISTORY[0].id);

  const selectedLead = useMemo(() => {
    return LEADS_WITH_HISTORY.find(l => l.id === selectedLeadId);
  }, [selectedLeadId]);

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-6">
        <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">Tactical Conversations</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Intelligence: Reviewing Lead Interaction Logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Sidebar */}
        <Card className="lg:col-span-1 rounded-none border-2 border-border shadow-sm h-fit">
          <CardHeader className="bg-secondary/5 border-b border-border">
            <CardTitle className="font-headline text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Active Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {LEADS_WITH_HISTORY.map(lead => (
              <button
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-none border-2 transition-all text-left ${
                  selectedLeadId === lead.id 
                    ? 'border-primary bg-primary/5 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]' 
                    : 'border-transparent hover:border-border hover:bg-muted/50'
                }`}
              >
                <Avatar className="h-8 w-8 rounded-none border border-border">
                  <AvatarFallback className="rounded-none font-black italic text-[10px]">{lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase italic text-xs truncate">{lead.name}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{lead.status}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="lg:col-span-3 rounded-none border-2 border-border shadow-md flex flex-col h-[600px]">
          {selectedLead ? (
            <>
              <CardHeader className="bg-secondary/5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-none border-2 border-primary">
                      <AvatarFallback className="rounded-none font-black italic text-lg">{selectedLead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-headline text-2xl font-black uppercase italic tracking-tighter">{selectedLead.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{selectedLead.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className="rounded-none font-black uppercase text-[9px] tracking-widest px-3 py-1">
                    {selectedLead.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 bg-background/50">
                <CardContent className="space-y-6 p-6">
                  {selectedLead.history.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className={`h-8 w-8 rounded-none border ${msg.sender === 'agent' ? 'border-primary' : 'border-foreground'}`}>
                        <AvatarFallback className="rounded-none bg-secondary/10">
                          {msg.sender === 'agent' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-foreground" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[70%] p-4 rounded-none border-2 ${
                          msg.sender === 'agent' 
                            ? 'bg-primary text-white border-primary shadow-[4px_4px_0px_rgba(0,0,0,0.1)] italic' 
                            : 'bg-card border-border font-medium'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-secondary/5">
                <div className="flex items-center gap-4 bg-background border-2 border-border p-4 opacity-50 cursor-not-allowed">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    Manual override disabled. AI Tactical Assistant is monitoring this encrypted link.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full text-center p-12 opacity-40">
              <MessageSquare className="h-16 w-16 mb-4 text-primary" />
              <h3 className="font-headline text-xl font-black uppercase italic">No Selection</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest">Select a lead from the registry to view history</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
