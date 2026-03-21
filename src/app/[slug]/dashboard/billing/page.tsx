"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CreditCard, Receipt, FileJson, FileText, CheckCircle2, MoreHorizontal, UserCheck, Shield, Zap } from "lucide-react";

export default function BillingPage() {
  const serviceFees = [
    { id: "SF-9012", date: "Oct 12, 2023", desc: "Software Membership Fee", amount: "$150.00", status: "Paid" },
    { id: "BP-4421", date: "Oct 05, 2023", desc: "Performance Bounty (Lead ID: 882)", amount: "$50.00", status: "Paid" },
    { id: "SF-8812", date: "Sep 12, 2023", desc: "Software Membership Fee", amount: "$150.00", status: "Paid" },
  ];

  const studentInvoices = [
    { id: "AS-001", name: "Marcus Aurelius", date: "Oct 10, 2023", plan: "Full Membership", amount: "$150.00", status: "Academy Own" },
    { id: "AS-002", name: "Lucius Vorenus", date: "Oct 09, 2023", plan: "Full Membership", amount: "$150.00", status: "Academy Own" },
    { id: "HS-005", name: "House Student #1", date: "Oct 06, 2023", plan: "Premium (Digital Lease)", amount: "$0.00", status: "House Asset" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-primary pl-6">
        <div>
          <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter leading-none">Tuition & Registry</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">Intelligence: Financial Matrix Oversight</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-none border-2 border-border font-black uppercase italic text-xs tracking-widest h-12 px-6">
             <Receipt className="h-4 w-4 mr-2" /> Export Audit
           </Button>
           <Button className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase italic tracking-widest h-12 px-8 shadow-xl">
             <CreditCard className="h-4 w-4 mr-2" /> Payment Matrix
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="bg-secondary/10 border-2 border-border p-1 rounded-none mb-8">
              <TabsTrigger value="service" className="rounded-none font-black uppercase italic tracking-widest text-xs px-8 data-[state=active]:bg-primary data-[state=active]:text-white gap-2 h-12">
                <Shield className="h-4 w-4" /> Service Fees ($150 / $50)
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-none font-black uppercase italic tracking-widest text-xs px-8 data-[state=active]:bg-primary data-[state=active]:text-white gap-2 h-12">
                <UserCheck className="h-4 w-4" /> Student Registry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="animate-in fade-in duration-500">
              <Card className="rounded-none border-2 border-border bg-card shadow-md">
                <CardHeader className="bg-secondary/5 border-b-2 border-border">
                  <CardTitle className="font-headline text-xl font-black uppercase italic">Service Payment Registry</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Fixed memberships and performance success handshakes.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-b border-border">
                        <TableHead className="font-black uppercase text-[9px] tracking-widest h-12">Reference</TableHead>
                        <TableHead className="font-black uppercase text-[9px] tracking-widest">Protocol Brief</TableHead>
                        <TableHead className="font-black uppercase text-[9px] tracking-widest">Amount</TableHead>
                        <TableHead className="text-right font-black uppercase text-[9px] tracking-widest">Registry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceFees.map((fee) => (
                        <TableRow key={fee.id} className="hover:bg-primary/5 border-b border-border transition-all">
                          <TableCell className="font-black italic text-primary">{fee.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-black uppercase italic">{fee.desc}</span>
                              <span className="text-[10px] text-muted-foreground font-bold">{fee.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-black italic">{fee.amount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none border border-transparent hover:border-primary">
                                 <FileJson className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none border border-transparent hover:border-primary">
                                 <FileText className="h-4 w-4" />
                               </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="animate-in fade-in duration-500">
              <Card className="rounded-none border-2 border-border bg-card shadow-md">
                <CardHeader className="bg-secondary/5 border-b-2 border-border">
                  <CardTitle className="font-headline text-xl font-black uppercase italic">Deployment Revenue Log</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Tuition records for academy and house students.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-b border-border">
                        <TableHead className="font-black uppercase text-[9px] tracking-widest h-12">Unit ID</TableHead>
                        <TableHead className="font-black uppercase text-[9px] tracking-widest">Callsign & Sector</TableHead>
                        <TableHead className="font-black uppercase text-[9px] tracking-widest">Revenue</TableHead>
                        <TableHead className="text-right font-black uppercase text-[9px] tracking-widest">Registry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentInvoices.map((inv) => (
                        <TableRow key={inv.id} className="hover:bg-primary/5 border-b border-border transition-all">
                          <TableCell className="font-black italic text-primary">{inv.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black uppercase italic">{inv.name}</span>
                                <Badge className={`rounded-none font-black uppercase text-[8px] px-2 py-0 h-4 ${inv.status === "House Asset" ? "bg-primary text-white" : "bg-green-600 text-white"}`}>
                                  {inv.status}
                                </Badge>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{inv.plan} • {inv.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-black italic">{inv.amount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none border border-transparent hover:border-primary">
                                 <FileJson className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none border border-transparent hover:border-primary" disabled={inv.status === "House Asset"}>
                                 <FileText className="h-4 w-4" />
                               </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-4 border-primary bg-primary/5 shadow-xl overflow-hidden relative">
            <Zap className="absolute top-0 right-0 h-32 w-32 text-primary opacity-10 rotate-12 -translate-y-8 translate-x-8" />
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-sm font-black uppercase italic tracking-widest flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" /> Official Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="p-4 bg-background border-2 border-primary/20 text-xs font-medium italic relative z-10">
                <p className="font-black uppercase text-primary mb-2 tracking-[0.2em]">Taxation Protocol Exemption</p>
                <p className="text-muted-foreground leading-relaxed">
                  Service fees processed via Foreign Source Handshake (Mexico). Zero U.S. withholding required per mission directive IRS Pub 515.
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest relative z-10">
                 <span className="text-muted-foreground">Active Configuration</span>
                 <Badge className="bg-primary text-white rounded-none italic px-4">HYBRID CORE</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-border bg-card shadow-md">
            <CardHeader className="bg-secondary/5 border-b-2 border-border p-6">
              <CardTitle className="text-sm font-black uppercase italic tracking-widest flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" /> Financial Source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <div className="flex items-center gap-6 p-6 border-2 border-border bg-background shadow-inner rounded-none">
                 <div className="bg-primary/10 p-3 border-2 border-primary rotate-45">
                   <CreditCard className="h-6 w-6 text-primary -rotate-45" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-black italic text-lg tracking-tighter">•••• 4242</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">SECURE LINK EXP 12/26</p>
                 </div>
                 <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 hover:text-primary rounded-none">
                   <MoreHorizontal className="h-5 w-5" />
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
