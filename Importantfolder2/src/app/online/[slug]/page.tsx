
'use client';
import { useParams, notFound } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { LandingPageData } from '@/lib/types';
import { Template1 } from '@/components/templates/Template1';
import { Template2 } from '@/components/templates/Template2';
import { Template3 } from '@/components/templates/Template3';
import { Template5 } from '@/components/templates/Template5';
import { Template6 } from '@/components/templates/Template6';
import { TemplateGB } from '@/components/templates/TemplateGB';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';

const templates = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template5: Template5,
  template6: Template6,
  templateGB: TemplateGB,
};

function PageSkeleton() {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
            </div>
             <div className="grid md:grid-cols-3 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
             </div>
        </div>
    )
}

export default function LandingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'landingPages', slug);
  }, [firestore, slug]);
  
  const { data, isLoading } = useDoc<LandingPageData>(docRef);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!data || !data.isPublic) {
    notFound();
  }

  const TemplateComponent = templates[data.selectedTemplate as keyof typeof templates];

  if (!TemplateComponent) {
      notFound();
  }
  
  return <TemplateComponent {...data} />;
}
