'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PreviewFrame() {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const frameWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight">Live Variable Preview</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Visualizing how your data variables populate the selected React template.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <Button 
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4 mr-2" /> Desktop
          </Button>
          <Button 
            variant={viewMode === 'tablet' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('tablet')}
          >
            <Tablet className="w-4 h-4 mr-2" /> Tablet
          </Button>
          <Button 
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-2" /> Mobile
          </Button>
        </div>

        <Button variant="outline" asChild size="sm" className="shadow-sm">
          <Link href="/webpage" target="_blank">
            <ExternalLink className="w-4 h-4 mr-2" /> Pop-out Preview
          </Link>
        </Button>
      </div>

      <Card className="mx-auto w-full shadow-2xl overflow-hidden border-2 border-primary/5 bg-slate-200">
        <div className="flex justify-center p-4 md:p-8 bg-grid-slate-100">
          <div className={`${frameWidths[viewMode]} transition-all duration-300 shadow-2xl rounded-xl overflow-hidden bg-white border border-slate-300`}>
             <div className="h-8 bg-slate-100 border-b flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="ml-4 bg-white px-3 py-0.5 rounded text-[10px] text-slate-400 flex-1 truncate">
                    https://leadflow-deploy.local/preview
                </div>
             </div>
             <div className="h-[800px] w-full">
                <iframe 
                  src="/webpage" 
                  className="w-full h-full border-none"
                  title="Live Preview"
                />
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
