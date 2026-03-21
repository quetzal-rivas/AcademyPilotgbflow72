'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { slugify } from '@/lib/utils';
import { Check, Copy, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TemplateId } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  slug: string;
  isPublic: boolean;
  enabledTemplates: TemplateId[];
  onSlugChange: (slug: string) => void;
  onVisibilityChange: (isPublic: boolean) => void;
}

export function SettingsPanel({
  slug,
  isPublic,
  enabledTemplates = [],
  onSlugChange,
  onVisibilityChange,
}: SettingsPanelProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const getFullUrl = (templateId?: string) => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin;
    if (!slug) return '';
    return templateId ? `${base}/online/${slug}/${templateId}` : `${base}/online/${slug}`;
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment & Settings</CardTitle>
        <CardDescription>Manage your URLs and public visibility.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="slug">Business Slug</Label>
          <Input
            id="slug"
            placeholder="your-business-name"
            value={slug}
            onChange={e => onSlugChange(slugify(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="is-public">Master Visibility</Label>
            <p className="text-xs text-muted-foreground">{isPublic ? 'Publicly accessible' : 'Private'}</p>
          </div>
          <Switch id="is-public" checked={isPublic} onCheckedChange={onVisibilityChange} />
        </div>

        {slug && enabledTemplates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Deployed Page Links</h3>
            </div>
            <Separator />
            <div className="space-y-3">
              {enabledTemplates.map((templateId) => {
                const url = getFullUrl(templateId);
                return (
                  <div key={templateId} className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase text-muted-foreground">{templateId}</span>
                    <div className="flex items-center gap-2">
                      <Input value={url} readOnly className="h-8 text-[11px] bg-muted/50" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(url)}>
                        {copiedLink === url ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={url} target="_blank">
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
