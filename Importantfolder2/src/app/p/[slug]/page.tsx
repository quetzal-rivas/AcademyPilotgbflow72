'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function DeprecatedPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    
    useEffect(() => {
        if (slug) {
            router.replace(`/online/${slug}`);
        } else {
            router.replace('/');
        }
    }, [slug, router]);

    return <PageSkeleton />;
}
