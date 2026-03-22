import { notFound } from 'next/navigation';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { AcademyTemplate } from '@/components/templates/academy-template';
import { getAcademyPhotos } from '@/app/actions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicAcademyPage({ params }: PageProps) {
  const { slug } = await params;
  const admin = getFirebaseAdmin();
  const db = admin.firestore();

  // Tactical Fetch: Retrieve landing page config from the public registry
  const landingPageDoc = await db.collection('landing_pages').doc(slug).get();
  const data = landingPageDoc.data();

  // We check isPublished instead of isPublic to match the seed script
  if (!landingPageDoc.exists || !data || !data.isPublished) {
    notFound();
  }

  // Tactical Intelligence: Fetching live photos based on the branch identity
  const photos = await getAcademyPhotos(data.branchName || "Gracie Barra");

  // Pass all the tenant-specific data down to the template
  return (
    <AcademyTemplate 
      slug={slug}
      branchName={data.branchName} 
      headline={data.headline}
      subheadline={data.subheadline}
      callToAction={data.callToAction}
      contactPhone={data.contactPhone}
      contactEmail={data.contactEmail}
      address={data.address}
      heroImage={data.heroImage}
      photos={photos} 
    />
  );
}