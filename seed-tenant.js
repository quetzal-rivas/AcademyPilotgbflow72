const admin = require('firebase-admin');

// Ensure you run this with FIREBASE_SERVICE_ACCOUNT environment variable set
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}

const db = admin.firestore();

async function seedTenant() {
  console.log("🌱 Starting Multi-Tenant Database Seeding (West Covina)...");

  const mockOwnerUid = 'owner-westcovina-123';
  const tenantSlug = 'westcovina';
  const tenantName = 'Gracie Barra West Covina';

  try {
    // 1. Create the Academy Owner Profile
    console.log("1. Creating Academy Owner profile...");
    const userRef = db.collection('user_profiles').doc(mockOwnerUid);
    await userRef.set({
      uid: mockOwnerUid,
      email: 'owner@gbwestcovina.com',
      role: 'academy_owner',
      tenantSlug: tenantSlug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      name: 'Professor West Covina',
      onboardingCompleted: true
    });

    // 2. Create the Public Landing Page Config
    console.log(`2. Creating Public Tenant Config for slug: /${tenantSlug}...`);
    const landingPageRef = db.collection('landing_pages').doc(tenantSlug);
    await landingPageRef.set({
      slug: tenantSlug,
      branchName: tenantName,
      ownerUid: mockOwnerUid,
      headline: 'Transform Your Life in West Covina',
      subheadline: 'Join the world\'s largest Jiu-Jitsu team at our premier West Covina facility. Train with the best.',
      callToAction: 'Claim Your West Covina Trial',
      contactPhone: '+1 626-555-0198',
      contactEmail: 'info@gbwestcovina.com',
      address: '1000 W Covina Pkwy, West Covina, CA 91790',
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
      }
    ];

    const batch = db.batch();
    for (const item of storeItems) {
      const itemRef = db.collection('tenants').doc(tenantSlug).collection('store_items').doc(item.id);
      batch.set(itemRef, item);
    }
    
    // 4. Add a mock lead for testing the dashboard
    console.log("4. Adding Mock Leads...");
    const leadRef = db.collection('leads').doc('mock-lead-wc-1');
    batch.set(leadRef, {
      tenantSlug: tenantSlug,
      name: 'West Covina Prospect',
      phone: '+16265551234',
      clase: 'Adult BJJ Fundamentals',
      visit_date: '2024-05-25',
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
    console.log(`- Owner Email: owner@gbwestcovina.com`);
    console.log("--------------------------------------------------");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedTenant();