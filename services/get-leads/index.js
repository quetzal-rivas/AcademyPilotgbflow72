const { getFirestore } = require('./firebase-admin');
const { logger, parseEventPayload, getRequestId, serializeError } = require('../logger');

/**
 * Get Leads Service (Multi-Tenant)
 * 
 * Retrieves a list of leads from the Firestore database for a specific tenant.
 * It enforces tenant isolation by requiring a tenantSlug and applying it to all queries.
 */
exports.handler = async (event) => {
  const payload = parseEventPayload(event);
  const requestId = getRequestId(event, payload);

  logger.info('Get leads service request received', {
    requestId,
    scope: 'service.get-leads',
  });

  try {
    // 1. Parse and Validate Input (Tenant Isolation)
    const { 
      tenantSlug,
      limit = 100, 
      orderBy = 'createdAt', 
      order = 'desc', 
      includeProcessed = false 
    } = payload;

    if (!tenantSlug) {
      logger.error('Security alert: attempted to fetch leads without tenantSlug', {
        requestId,
        scope: 'service.get-leads',
      });
      return {
        success: false,
        error: 'Bad Request',
        details: 'tenantSlug is required for data isolation.',
        requestId,
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

    logger.info('Leads retrieved successfully', {
      requestId,
      scope: 'service.get-leads',
      tenantSlug,
      count: leads.length,
    });

    return {
      success: true,
      total: leads.length,
      leads: leads,
      requestId,
    };

  } catch (error) {
    logger.error('Get leads service error', {
      requestId,
      scope: 'service.get-leads',
      tenantSlug: payload.tenantSlug || 'Unknown',
      error: serializeError(error),
    });
    return {
      success: false,
      error: 'Internal Server Error',
      details: error.message,
      requestId,
    };
  }
};