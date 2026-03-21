'use client';

import { useEffect, useState, useTransition, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc } from 'firebase/firestore';

import type { LandingPageData, TemplateId } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { BusinessInfoForm } from '@/components/editor/BusinessInfoForm';
import { formSchema } from '@/lib/schemas';
import { SettingsPanel } from '@/components/editor/SettingsPanel';
import { generateContentAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Globe } from 'lucide-react';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { useUser, useFirebase, initiateAnonymousSignIn, setDocumentNonBlocking } from '@/firebase';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { PreviewFrame } from '@/components/editor/PreviewFrame';

const defaultData: LandingPageData = {
  userId: '',
  companyInfo: {
    name: '',
    description: '',
    phone: '',
    hours: '',
    socialLinks: [],
  },
  media: {
    coverImage: '',
    galleryImages: [],
    promotionalVideo: '',
  },
  offerings: [],
  slug: '',
  selectedTemplate: 'template1',
  enabledTemplates: ['template1'],
  isPublic: true,
  generatedContent: null,
};

export default function EditorPage() {
  const [data, setData] = useLocalStorage<LandingPageData>('landingPageData', defaultData);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const methods = useForm<LandingPageData>({
    resolver: zodResolver(formSchema),
    defaultValues: data || defaultData,
  });
  
  const { reset, watch, setValue } = methods;
  const isInitializing = useRef(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync from LocalStorage to Form on mount
  useEffect(() => {
    if (isMounted && isInitializing.current) {
      if (data) {
        reset(data);
      }
      isInitializing.current = false;
    }
  }, [isMounted, data, reset]);

  const watchedData = watch();

  // Sync from Form to LocalStorage on change
  useEffect(() => {
    if (isMounted && !isInitializing.current) {
      const currentStorageString = JSON.stringify(data);
      const currentFormString = JSON.stringify(watchedData);
      
      if (currentStorageString !== currentFormString) {
        setData(watchedData);
      }
    }
  }, [watchedData, data, setData, isMounted]);

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleFormSubmit = methods.handleSubmit(formData => {
    startTransition(async () => {
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be signed in to save a page.',
        });
        return;
      }
      
      const currentSlug = formData.slug || slugify(formData.companyInfo.name);
      if(!formData.slug) {
        setValue('slug', currentSlug);
      }
      
      const result = await generateContentAction(formData);

      if (result.success) {
        const pageData: LandingPageData = {
            ...formData,
            userId: user.uid,
            slug: currentSlug,
            generatedContent: result.data,
        };
        
        setData(pageData);
        reset(pageData);

        const docRef = doc(firestore, 'landingPages', currentSlug);
        setDocumentNonBlocking(docRef, pageData, { merge: true });

        toast({
          title: 'Deployment Successful!',
          description: `All templates are now live at your-slug-urls.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
    });
  });

  const handleToggleTemplate = (templateId: TemplateId) => {
    const currentEnabled = watchedData.enabledTemplates || [];
    if (currentEnabled.includes(templateId)) {
      setValue('enabledTemplates', currentEnabled.filter(id => id !== templateId));
    } else {
      setValue('enabledTemplates', [...currentEnabled, templateId]);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setValue('slug', newSlug);
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    setValue('isPublic', isPublic);
  };

  const handleImageUpload = (base64Images: string[]) => {
    setValue('media.galleryImages', base64Images);
    if (base64Images.length > 0 && !watchedData.media.coverImage) {
      setValue('media.coverImage', base64Images[0]);
    }
  };

  const handleVideoUpload = (base64Video: string) => {
    setValue('media.promotionalVideo', base64Video);
  };
  
  const handleReset = () => {
    if(window.confirm("This will wipe all local progress. Your live deployments will remain unchanged until you save again. Continue?")) {
      const resetData = {...defaultData, userId: user?.uid || ''};
      setData(resetData);
      reset(resetData);
    }
  }

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1">
        <FormProvider {...methods}>
          <div className="container mx-auto py-8 px-4">
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <BusinessInfoForm
                    onImageUpload={handleImageUpload}
                    galleryImages={watchedData.media?.galleryImages || []}
                    onVideoUpload={handleVideoUpload}
                    promotionalVideo={watchedData.media?.promotionalVideo}
                  />
                   <TemplateSelector
                    enabledTemplates={watchedData.enabledTemplates || []}
                    onToggleTemplate={handleToggleTemplate}
                  />
                </div>

                <div className="space-y-8 lg:sticky lg:top-24">
                  <SettingsPanel
                    slug={watchedData.slug}
                    isPublic={watchedData.isPublic}
                    enabledTemplates={watchedData.enabledTemplates || []}
                    onSlugChange={handleSlugChange}
                    onVisibilityChange={handleVisibilityChange}
                  />
                  
                  <Card className="border-primary/20 shadow-xl overflow-hidden">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <Button type="submit" disabled={isPending || isUserLoading} className="w-full h-12 text-lg shadow-lg" size="lg">
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            <Globe className="w-5 h-5 mr-2" />
                            Deploy All Templates
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleReset} className="w-full text-muted-foreground hover:text-destructive">
                        Reset Local Canvas
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
            
            <Separator className="my-16" />
            
            <PreviewFrame />
          </div>
        </FormProvider>
      </main>
    </div>
  );
}
