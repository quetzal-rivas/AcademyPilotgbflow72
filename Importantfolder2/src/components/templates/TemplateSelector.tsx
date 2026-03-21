
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TemplateId } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TemplateSelectorProps {
  enabledTemplates: TemplateId[];
  onToggleTemplate: (id: TemplateId) => void;
}

const templates: { id: TemplateId; name: string; description: string }[] = [
  { id: 'templateGB', name: 'Gracie Barra AI', description: 'Premium martial arts & lead capture design.' },
  { id: 'template1', name: 'Professional', description: 'Clean, professional, and corporate.' },
  { id: 'template2', name: 'Minimalist', description: 'Modern, simple, and image-focused.' },
  { id: 'template3', name: 'Creative', description: 'Vibrant, modern, and artistic.' },
  { id: 'template5', name: 'Sleek Dark', description: 'Modern, dark, and minimalist.' },
  { id: 'template6', name: 'Retro Pop', description: 'Fun, vibrant, and retro.' },
];

function TemplateGBPreview() {
  return (
    <div className="w-full h-full bg-slate-900 p-2 space-y-2 rounded flex flex-col justify-center items-center">
      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-[8px]">GB</div>
      <div className="h-4 bg-red-600 w-3/4 rounded-sm"></div>
      <div className="h-2 bg-slate-700 w-1/2 rounded-sm"></div>
      <div className="w-full h-12 bg-white rounded flex flex-col p-1 gap-1">
          <div className="h-1 bg-slate-200 w-full rounded-sm"></div>
          <div className="h-1 bg-slate-200 w-full rounded-sm"></div>
          <div className="h-3 bg-red-600 w-full rounded-sm"></div>
      </div>
    </div>
  )
}

function Template1Preview() {
  return (
    <div className="w-full h-full bg-slate-200 p-2 space-y-2 rounded">
      <div className="h-1/3 bg-slate-500 rounded-sm"></div>
      <div className="h-1/4 bg-slate-400 rounded-sm"></div>
      <div className="flex-grow grid grid-cols-3 gap-2">
        <div className="bg-slate-400 rounded-sm"></div>
        <div className="bg-slate-400 rounded-sm"></div>
        <div className="bg-slate-400 rounded-sm"></div>
      </div>
    </div>
  )
}

function Template2Preview() {
  return (
    <div className="w-full h-full bg-gray-200 p-2 flex gap-2 rounded">
      <div className="w-1/2 bg-gray-400 rounded-sm"></div>
      <div className="w-1/2 h-full bg-gray-500 rounded-sm"></div>
    </div>
  )
}

function Template3Preview() {
    return (
        <div className="w-full h-full bg-purple-100 p-2 space-y-2 rounded">
            <div className="h-1/4 bg-purple-300 rounded-sm flex justify-center items-center font-bold text-purple-800 text-[8px]">Headline</div>
            <div className="flex-grow grid grid-cols-3 gap-2 h-1/2">
                <div className="bg-pink-200 rounded-sm"></div>
                <div className="bg-pink-200 rounded-sm"></div>
                <div className="bg-pink-200 rounded-sm"></div>
            </div>
             <div className="h-1/4 bg-orange-200 rounded-sm"></div>
        </div>
    )
}

function Template5Preview() {
    return (
        <div className="w-full h-full bg-gray-900 p-2 space-y-2 rounded">
            <div className="h-1/2 bg-gray-700 rounded-sm"></div>
            <div className="h-1/4 bg-gray-600 w-3/4 rounded-sm"></div>
             <div className="h-px bg-gray-500 w-full"></div>
        </div>
    )
}

function Template6Preview() {
    return (
        <div className="w-full h-full bg-yellow-200 p-2 grid grid-cols-3 gap-2 rounded">
            <div className="bg-pink-400 rounded-sm col-span-2"></div>
            <div className="bg-blue-400 rounded-sm"></div>
            <div className="bg-teal-400 rounded-sm"></div>
            <div className="bg-purple-400 rounded-sm col-span-2"></div>
        </div>
    )
}

const previews = {
  templateGB: <TemplateGBPreview />,
  template1: <Template1Preview />,
  template2: <Template2Preview />,
  template3: <Template3Preview />,
  template5: <Template5Preview />,
  template6: <Template6Preview />,
}

export function TemplateSelector({ enabledTemplates = [], onToggleTemplate }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Turn on Templates</CardTitle>
        <CardDescription>Enable designs to deploy them to unique URLs.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(template => {
          const isEnabled = enabledTemplates.includes(template.id);
          return (
            <div
              key={template.id}
              className={cn(
                'border-2 rounded-lg p-3 transition-all',
                isEnabled ? 'border-primary shadow-md' : 'border-border'
              )}
            >
              <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                  {previews[template.id as keyof typeof previews]}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-none">{template.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                </div>
                <Switch 
                  checked={isEnabled} 
                  onCheckedChange={() => onToggleTemplate(template.id)}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
