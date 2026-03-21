const admin = require('firebase-admin');

// Ensure you run this with FIREBASE_SERVICE_ACCOUNT environment variable set,
// or use the default credential if running in an environment with service account access.
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Fallback to default application credentials
    admin.initializeApp();
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}

const db = admin.firestore();

async function seedTenant() {
  console.log("🌱 Starting Multi-Tenant Database Seeding...");

  const mockOwnerUid = 'demo-owner-12345';
  const tenantSlug = 'gb-demo';
  const tenantName = 'Gracie Barra Demo Academy';

  try {
    // 1. Create the Academy Owner Profile (Tenant Admin)
    console.log("1. Creating Academy Owner profile...");
    const userRef = db.collection('user_profiles').doc(mockOwnerUid);
    await userRef.set({
      uid: mockOwnerUid,
      email: 'owner@gbdemo.com',
      role: 'academy_owner',
      tenantSlug: tenantSlug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      name: 'Professor Demo',
      onboardingCompleted: true
    });

    // 2. Create the Public Landing Page / Tenant Config
    console.log(`2. Creating Public Tenant Config for slug: /${tenantSlug}...`);
    const landingPageRef = db.collection('landing_pages').doc(tenantSlug);
    await landingPageRef.set({
      slug: tenantSlug,
      branchName: tenantName,
      ownerUid: mockOwnerUid,
      headline: 'Transform Your Life Through Jiu-Jitsu',
      subheadline: 'Join the world\'s largest Jiu-Jitsu team at our premier demo facility.',
      callToAction: 'Book Your Free Trial Class Today',
      contactPhone: '+1 555-0198',
      contactEmail: 'hello@gbdemo.com',
      address: '123 Martial Arts Way, Suite 100',
      heroImage: 'https://graciebarra.com/wp-content/uploads/2025/04/DSC06242bbb_1.png',
      isPublished: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. Populate the Tenant's Store Inventory
    console.log("3. Populating Academy Store with Official GB Gear...");
    const storeItems = [
      {
        id: 'gb-kimono-white',
        name: 'GB PRO KIMONO WHITE',
        price: 120,
        description: 'The classic white uniform for the traditional martial artist. Unmatched quality.',
        details: 'Official competition-ready Gracie Barra Kimono. Premium white pearl weave construction.',
        tag: 'LEGACY TRADITION',
        imageUrl: 'https://graciebarrapilot.s3.us-east-1.amazonaws.com/Kiminiblanco.png',
        stock: 50,
        tenantSlug: tenantSlug
      },
      {
        id: 'gb-kimono-blue',
        name: 'GB PRO KIMONO BLUE',
        price: 130,
        description: 'Stand out on the mats with the official blue uniform.',
        details: 'Durable and lightweight blue pearl weave construction.',
        tag: 'COMPETITION READY',
        imageUrl: 'https://graciebarrapilot.s3.us-east-1.amazonaws.com/kimonoazul.png',
        stock: 30,
        tenantSlug: tenantSlug
      },
      {
        id: 'gb-rashguard-white',
        name: 'GB TRAINING RASHGUARD WHITE',
        price: 55,
        description: 'Essential No-Gi training gear.',
        details: 'Moisture-wicking, reinforced stitching, official GB ranked design.',
        tag: 'NO-GI ESSENTIAL',
        imageUrl: 'https://graciebarrapilot.s3.us-east-1.amazonaws.com/gbrashwhite.png',
        stock: 100,
        tenantSlug: tenantSlug
      }
    ];

    const batch = db.batch();
    for (const item of storeItems) {
      // Create subcollection for tenant specific store items to ensure multi-tenant data isolation
      const itemRef = db.collection('tenants').doc(tenantSlug).collection('store_items').doc(item.id);
      batch.set(itemRef, item);
    }
    
    // 4. Add a mock lead for testing the dashboard
    console.log("4. Adding Mock Leads...");
    const leadRef = db.collection('leads').doc('mock-lead-1');
    batch.set(leadRef, {
      tenantSlug: tenantSlug,
      name: 'John Doe',
      phone: '+15551234567',
      clase: 'Adult BJJ Fundamentals',
      visit_date: '2024-05-20',
      processed: false,
      source: 'landing_page',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    console.log("✅ Multi-Tenant Database Seeding Completed Successfully!");
    console.log("--------------------------------------------------");
    console.log("🧪 Mock Tenant Data:");
    console.log(`- Slug: /${tenantSlug}`);
    console.log(`- Owner UID: ${mockOwnerUid}`);
    console.log(`- Owner Email: owner@gbdemo.com`);
    console.log("--------------------------------------------------");
    console.log("You can now mock login with this UID to see the dashboard, or visit /gb-demo to see the public landing page.");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedTenant();