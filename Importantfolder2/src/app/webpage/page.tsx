
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { LandingPageData, TemplateId } from '@/lib/types';
import { Template1 } from '@/components/templates/Template1';
import { Template2 } from '@/components/templates/Template2';
import { Template3 } from '@/components/templates/Template3';
import { Template5 } from '@/components/templates/Template5';
import { Template6 } from '@/components/templates/Template6';
import { TemplateGB } from '@/components/templates/TemplateGB';

const defaultData: LandingPageData = {
  userId: '',
  companyInfo: {
    name: '',
    description: '',
    phone: '',
    hours: '',
    socialLinks: [''],
  },
  media: {
    coverImage: '',
    galleryImages: [],
    promotionalVideo: '',
  },
  offerings: [],
  slug: '',
  selectedTemplate: 'templateGB',
  enabledTemplates: ['templateGB'],
  isPublic: true,
  generatedContent: null,
};

const templates: Record<TemplateId, React.ComponentType<LandingPageData>> = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template5: Template5,
  template6: Template6,
  templateGB: TemplateGB,
};

export default function WebpagePreview() {
  const [data] = useLocalStorage<LandingPageData>('landingPageData', defaultData);

  const CurrentTemplate = templates[data.selectedTemplate];

  if (!CurrentTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Preview Loading...</h1>
          <p className="text-muted-foreground mt-2">If this persists, try selecting a template in the editor.</p>
        </div>
      </div>
    );
  }

  return <CurrentTemplate {...data} />;
}
