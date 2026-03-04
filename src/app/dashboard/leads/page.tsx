
"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, MessageSquare, Phone, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialLeads = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-0101", status: "New", source: "Facebook Ad", date: "2024-05-20" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+1 555-0102", status: "Qualified", source: "WhatsApp", date: "2024-05-19" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", phone: "+1 555-0103", status: "Contacted", source: "Voice AI", date: "2024-05-19" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", phone: "+1 555-0104", status: "Converted", source: "Messenger", date: "2024-05-18" },
  { id: 5, name: "Ethan Hunt", email: "ethan@example.com", phone: "+1 555-0105", status: "New", source: "Instagram Ad", date: "2024-05-18" },
  { id: 6, name: "Fiona Apple", email: "fiona@example.com", phone: "+1 555-0106", status: "Qualified", source: "Website", date: "2024-05-17" },
  { id: 7, name: "George Bluth", email: "george@example.com", phone: "+1 555-0107", status: "Lost", source: "Voice AI", date: "2024-05-17" },
];

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = initialLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Manage and filter all potential students captured by Academia Pilot.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads by name or email..." 
            className="pl-10 bg-background border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-lg">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Captured Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-secondary/30">
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-muted-foreground">{lead.email}</span>
                    <span>{lead.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal text-[10px] uppercase bg-secondary/80">
                    {lead.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{lead.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'New': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Converted': return 'bg-accent/20 text-accent border-accent/30';
    case 'Lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-secondary text-foreground';
  }
}
