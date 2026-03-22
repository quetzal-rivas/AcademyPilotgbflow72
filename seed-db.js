const admin = require('firebase-admin');

// Initialize Firebase using Application Default Credentials (since we are authenticated via Firebase CLI)
try {
  admin.initializeApp({
    projectId: 'studio-5472086834-71ab7'
  });
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  process.exit(1);
}

const db = admin.firestore();

async function seedTenant() {
  console.log("🌱 Starting Multi-Tenant Database Seeding for project: studio-5472086834-71ab7...");

  // Using the specific user ID found in your authentication export
  const ownerUid = 'OX1rkR2HSfW0svLLXUf11alG9qG2'; 
  const tenantSlug = 'westcovina';
  const tenantName = 'Gracie Barra West Covina';

  try {
    const batch = db.batch();

    // 1. Create/Update the Academy Owner Profile
    console.log(`1. Setting up User Profile for ${ownerUid}...`);
    const userRef = db.collection('user_profiles').doc(ownerUid);
    batch.set(userRef, {
      uid: ownerUid,
      email: 'tester@gmail.com',
      role: 'academy_owner',
      tenantSlug: tenantSlug,
      name: 'Professor Tester',
      onboardingCompleted: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // 2. Create the Public Landing Page Config
    console.log(`2. Creating Public Tenant Config for slug: /${tenantSlug}...`);
    const landingPageRef = db.collection('landing_pages').doc(tenantSlug);
    batch.set(landingPageRef, {
      slug: tenantSlug,
      branchName: tenantName,
      ownerUid: ownerUid,
      headline: 'Transform Your Life in West Covina',
      subheadline: 'Join the world\'s largest Jiu-Jitsu team at our premier West Covina facility. Train with the best.',
      callToAction: 'Claim Your West Covina Trial',
      contactPhone: '+1 626-555-0198',
      contactEmail: 'info@gbwestcovina.com',
      address: '1000 W Covina Pkwy, West Covina, CA 91790',
      heroImage: 'https://graciebarra.com/wp-content/uploads/2025/04/DSC06242bbb_1.png',
      isPublished: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // 3. Add a mock lead for testing the dashboard
    console.log("3. Adding Mock Lead...");
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

    // 4. Populate the Tenant's Store Inventory
    console.log("4. Populating Academy Store with Official GB Gear...");
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

    for (const item of storeItems) {
      const itemRef = db.collection('tenants').doc(tenantSlug).collection('store_items').doc(item.id);
      batch.set(itemRef, item);
    }

    await batch.commit();

    console.log("✅ Multi-Tenant Database Seeding Completed Successfully!");
    console.log("--------------------------------------------------");
    console.log("🧪 Tenant Data:");
    console.log(`- Slug: /${tenantSlug}`);
    console.log(`- Owner UID: ${ownerUid} (tester@gmail.com)`);
    console.log("--------------------------------------------------");
    console.log("You can now log in with tester@gmail.com to see the dashboard at /westcovina/dashboard, or visit /westcovina to see the public landing page.");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedTenant();