const { getFirestore } = require('./firebase-admin');
const { logger, parseEventPayload, getRequestId, serializeError } = require('../logger');

/**
 * Add Lead Handler (Multi-Tenant)
 * 
 * This function adds a new lead to the Firestore database. It requires a tenantSlug
 * to associate the new lead with the correct academy.
 */
exports.handler = async (event) => {
  const body = parseEventPayload(event);
  const requestId = getRequestId(event, body);

  logger.info('Add lead service request received', {
    requestId,
    scope: 'service.add-lead',
  });

  try {
    // Extracting email as well
    const { tenantSlug, name, phone, email, clase, visit_date, note, uniform, source } = body;

    // 2. Validate Tenant and Required Fields
    if (!tenantSlug) {
      logger.error('Security alert: attempted to add a lead without tenantSlug', {
        requestId,
        scope: 'service.add-lead',
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: tenantSlug is required.', requestId })
      };
    }

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: name and phone', requestId })
      };
    }

    // 3. Initialize Firestore
    const db = getFirestore();

    // 4. Prepare Lead Document
    const leadData = {
      tenantSlug, // Explicitly assign the lead to the tenant
      name,
      phone,
      email: email || null, // Optional for backward compatibility, but highly recommended
      clase: clase || 'sin especificar',
      visit_date: visit_date || null,
      note: note || '',
      uniform: uniform !== undefined ? !!uniform : null, 
      source: source || 'orchestrator', 
      processed: false,
      createdAt: new Date(),
    };

    // 5. Add to Firestore
    const docRef = await db.collection('leads').add(leadData);

    logger.info('Lead added successfully', {
      requestId,
      scope: 'service.add-lead',
      tenantSlug,
      leadId: docRef.id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: docRef.id, requestId })
    };

  } catch (error) {
    logger.error('Add lead service error', {
      requestId,
      scope: 'service.add-lead',
      error: serializeError(error),
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message, requestId })
    };
  }
};