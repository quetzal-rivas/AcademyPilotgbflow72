
import type { GenerateLandingPageContentOutput } from "@/ai/flows/generate-landing-page-content";

export type TemplateId = 'template1' | 'template2' | 'template3' | 'template5' | 'template6' | 'templateGB';

export interface Offering {
  name: string;
  description: string;
  image?: string;
}

export interface LandingPageData {
  userId: string;
  companyInfo: {
    name: string;
    description: string;
    phone: string;
    hours: string;
    socialLinks: string[];
  };
  media: {
    coverImage: string;
    galleryImages: string[];
    promotionalVideo?: string;
  };
  offerings: Offering[];
  slug: string;
  selectedTemplate: TemplateId;
  enabledTemplates: TemplateId[];
  isPublic: boolean;
  generatedContent: GenerateLandingPageContentOutput | null;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
}
