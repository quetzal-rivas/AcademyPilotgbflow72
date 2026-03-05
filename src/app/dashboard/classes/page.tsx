
"use client";

import { useState } from 'react';
import { CheckInProvider, useCheckIn } from '@/context/checkin-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Users, QrCode, Lock, Unlock, Calendar, LayoutGrid, Monitor, Zap } from 'lucide-react';
import Link from 'next/link';

function ClassManagementContent() {
  const { classes, createClass, toggleCheckInStatus } = useCheckIn();
  const [newClassName, setNewClassName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;
    createClass({
      name: newClassName,
      startTime: new Date(new Date().getTime() + 60 * 60 * 1000),
      instructor: 'Lead Instructor',
    });
    setNewClassName('');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-primary pl-6">
        <div>
          <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none">Session Command</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Ops: Real-Time Class Management</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest px-8 h-12 shadow-xl">
          <Link href="/checkin-display" target="_blank">
            <Monitor className="mr-2 h-4 w-4" /> Open Live Display
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="bg-secondary/10 border-2 border-border p-1 rounded-none mb-8">
              <TabsTrigger value="schedule" className="rounded-none font-black uppercase italic tracking-widest text-xs px-8 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                <Calendar className="w-4 h-4" /> Strategic Schedule
              </TabsTrigger>
              <TabsTrigger value="attendance" className="rounded-none font-black uppercase italic tracking-widest text-xs px-8 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                <Users className="w-4 h-4" /> Deployment Registry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              {classes.map((c) => (
                <Card key={c.id} className="rounded-none border-2 border-border bg-card overflow-hidden group hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-secondary/10 flex flex-col items-center justify-center border-2 border-border group-hover:border-primary">
                          <p className="text-[10px] font-black uppercase tracking-tighter leading-none">START</p>
                          <p className="font-black italic text-sm">{c.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">{c.name}</h3>
                            <Badge className={`rounded-none font-black uppercase text-[9px] tracking-widest px-3 ${c.status === 'open' ? 'bg-green-600' : 'bg-muted text-foreground'}`}>
                              {c.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Zap className="w-3 h-3 text-primary" /> COMMAND: {c.instructor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-none font-black uppercase tracking-widest text-[10px] border-2 h-10 px-6 gap-2" onClick={() => toggleCheckInStatus(c.id)}>
                          {c.status === 'open' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          {c.status === 'open' ? 'Terminate Entry' : 'Open Matrix'}
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-none h-10 w-10 border-2 border-border">
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="rounded-none border-2 border-border bg-card">
                <CardHeader className="bg-secondary/5 border-b-2 border-border">
                  <CardTitle className="font-headline text-lg font-black uppercase italic tracking-widest flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-primary" /> Enrollment Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {classes.map(c => (
                      <div key={c.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <h4 className="font-black uppercase italic text-sm text-primary">{c.name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{c.attendees.length} Verified Units</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {c.attendees.length > 0 ? c.attendees.map(a => (
                            <Badge key={a} className="bg-secondary/10 text-foreground border-2 border-border rounded-none font-black uppercase italic text-[9px] px-3 py-1">
                              {a}
                            </Badge>
                          )) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 italic">No deployments detected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-4 border-primary bg-primary/5 shadow-xl">
            <CardHeader className="bg-primary p-6">
              <CardTitle className="text-white font-black uppercase italic italic text-xl tracking-tighter">Initialize Session</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="className" className="text-[10px] font-black uppercase tracking-widest">Protocol Callsign</Label>
                  <Input id="className" placeholder="e.g. GB1 FUNDAMENTALS" value={newClassName} onChange={(e) => setNewClassName(e.target.value.toUpperCase())} className="rounded-none border-2 h-12 font-black italic uppercase" />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-14">
                  <Plus className="mr-2 h-5 w-5" /> Launch Mission
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-border bg-card shadow-md">
            <CardHeader className="bg-secondary/5 border-b-2 border-border">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">Live Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Matrices</span>
                <span className="text-3xl font-black italic">{classes.filter(c => c.status === 'open').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Deployments</span>
                <span className="text-3xl font-black italic text-primary">{classes.reduce((acc, c) => acc + c.attendees.length, 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ClassManagementPage() {
  return (
    <CheckInProvider>
      <ClassManagementContent />
    </CheckInProvider>
  );
}
