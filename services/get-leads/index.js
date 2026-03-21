const { getFirestore } = require('./firebase-admin');

/**
 * Get Leads Service (Multi-Tenant)
 * 
 * Retrieves a list of leads from the Firestore database for a specific tenant.
 * It enforces tenant isolation by requiring a tenantSlug and applying it to all queries.
 */
exports.handler = async (event) => {
  console.log('--- GET LEADS SERVICE ---');

  try {
    // 1. Parse and Validate Input (Tenant Isolation)
    const { 
      tenantSlug,
      limit = 100, 
      orderBy = 'createdAt', 
      order = 'desc', 
      includeProcessed = false 
    } = event;

    if (!tenantSlug) {
      console.error('Security Alert: Attempted to fetch leads without a tenantSlug.');
      return {
        success: false,
        error: 'Bad Request',
        details: 'tenantSlug is required for data isolation.'
      };
    }

    const db = getFirestore();
    
    // 2. Base Query scoped strictly to the tenant
    let query = db.collection('leads').where('tenantSlug', '==', tenantSlug);

    // 3. Apply Optional Filters
    if (!includeProcessed) {
      query = query.where('processed', '==', false);
    }

    // 4. Apply Sorting and Pagination
    // Note: In Firestore, if you have an inequality filter (like '==') on one field (tenantSlug), 
    // and you order by another field (createdAt), you will likely need a composite index.
    query = query.orderBy(orderBy, order).limit(Number(limit));

    // 5. Execute Query
    const snapshot = await query.get();
    
    // 6. Format Response
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt
    }));

    console.log(`Successfully retrieved ${leads.length} leads for tenant: ${tenantSlug}.`);

    return {
      success: true,
      total: leads.length,
      leads: leads
    };

  } catch (error) {
    console.error(`Get Leads Service Error (Tenant: ${event.tenantSlug || 'Unknown'}):`, error);
    return {
      success: false,
      error: 'Internal Server Error',
      details: error.message
    };
  }
};