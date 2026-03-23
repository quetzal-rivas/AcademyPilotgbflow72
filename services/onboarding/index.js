const AWS = require('aws-sdk');

const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-2' });
const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-2' });

const ROOT_DOMAIN = 'graciebarra.ai';

// We fetch secrets dynamically at runtime to satisfy AWS Security constraints on SecureStrings
let CLOUDFLARE_API_TOKEN = null;
let CLOUDFLARE_ZONE_ID = null;

async function fetchSecrets() {
    if (CLOUDFLARE_API_TOKEN && CLOUDFLARE_ZONE_ID) return; // Cache them during cold starts

    console.log("Fetching secure parameters from AWS SSM...");
    try {
        const response = await ssm.getParameters({
            Names: [
                process.env.CLOUDFLARE_API_TOKEN_PATH || '/app/cloudflare-api-token',
                process.env.CLOUDFLARE_ZONE_ID_PATH || '/app/cloudflare-zone-id'
            ],
            WithDecryption: true
        }).promise();

        const parameters = response.Parameters;
        
        const tokenParam = parameters.find(p => p.Name.includes('api-token'));
        const zoneParam = parameters.find(p => p.Name.includes('zone-id'));

        if (!tokenParam || !zoneParam) {
             throw new Error("Failed to retrieve one or more required SSM parameters.");
        }

        CLOUDFLARE_API_TOKEN = tokenParam.Value;
        CLOUDFLARE_ZONE_ID = zoneParam.Value;
        console.log("Secrets successfully decrypted and cached in memory.");
    } catch (err) {
        console.error("Critical Error: Failed to fetch secrets from SSM.", err);
        throw err;
    }
}


/**
 * Tenant Onboarding Service
 * 
 * Orchestrates the provisioning of email infrastructure for a new academy tenant.
 * It coordinates AWS SES (Verification, MAIL FROM, Receipt Rules) and Cloudflare (DNS Records).
 */
exports.handler = async (event) => {
  console.log('--- TENANT ONBOARDING INITIATED ---');
  
  try {
    const { tenantSlug, ownerEmail } = event;
    
    if (!tenantSlug || !ownerEmail) {
      console.error('Missing required parameters: tenantSlug and ownerEmail');
      return { statusCode: 400, body: JSON.stringify({ error: 'tenantSlug and ownerEmail are required' }) };
    }

    // 1. Retrieve Secrets BEFORE executing logic
    await fetchSecrets();

    const customEmailIdentity = `${tenantSlug}@${ROOT_DOMAIN}`;
    const customMailFromDomain = `mail.${tenantSlug}.${ROOT_DOMAIN}`;
    
    console.log(`Provisioning communications for: ${customEmailIdentity}`);

    // =========================================================================
    // PHASE 1: CLOUDFLARE DNS PROVISIONING
    // =========================================================================
    console.log(`[Phase 1] Configuring Cloudflare DNS for ${customMailFromDomain}...`);
    
    const cfFetch = async (endpoint, method, body) => {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Cloudflare API Error (${response.status}): ${errBody}`);
        }
        return await response.json();
    };

    // 1a. Create MX Record (Directing replies back to AWS SES)
    console.log(`  -> Creating MX Record for ${customMailFromDomain}`);
    await cfFetch('/dns_records', 'POST', {
        type: "MX",
        name: customMailFromDomain,
        content: `inbound-smtp.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com`, // SES specific inbound endpoint
        priority: 10,
        proxied: false, // Critical: MUST NOT BE PROXIED
        ttl: 300
    });

    // 1b. Create SPF TXT Record (Authorizing AWS to send on behalf of the subdomain)
    console.log(`  -> Creating SPF Record for ${customMailFromDomain}`);
    await cfFetch('/dns_records', 'POST', {
        type: "TXT",
        name: customMailFromDomain,
        content: "v=spf1 include:amazonses.com ~all",
        proxied: false,
        ttl: 300
    });

    // 1c. Create DMARC Record (For the specific tenant subdomain)
    console.log(`  -> Creating DMARC Record for _dmarc.${customMailFromDomain}`);
    await cfFetch('/dns_records', 'POST', {
        type: "TXT",
        name: `_dmarc.${customMailFromDomain}`,
        content: "v=DMARC1; p=none; rua=mailto:postmaster@graciebarra.ai",
        proxied: false,
        ttl: 300
    });

    console.log('[Phase 1] Cloudflare DNS Provisioned Successfully.');

    // =========================================================================
    // PHASE 2: AWS SES CONFIGURATION
    // =========================================================================
    console.log(`\n[Phase 2] Configuring AWS SES for ${customEmailIdentity}...`);

    // 2a. Verify the Custom Email Identity (westcovina@graciebarra.ai)
    console.log(`  -> Sending VerifyEmailIdentity command`);
    await ses.verifyEmailIdentity({ EmailAddress: customEmailIdentity }).promise();

    // 2b. Set the Custom MAIL FROM Domain
    console.log(`  -> Setting Identity MAIL FROM domain to ${customMailFromDomain}`);
    await ses.setIdentityMailFromDomain({
      Identity: customEmailIdentity,
      MailFromDomain: customMailFromDomain,
      BehaviorOnMXFailure: 'UseDefaultValue' // Fallback to Amazon SES if our custom MX fails
    }).promise();

    // 2c. Setup Inbound Receipt Rule
    console.log(`  -> Creating SES Receipt Rule for inbound routing`);
    const ruleSetName = 'TenantIncomingMailRules';
    const bucketName = process.env.INCOMING_EMAILS_BUCKET;

    try {
        await ses.describeReceiptRuleSet({ RuleSetName: ruleSetName }).promise();
    } catch (err) {
        if (err.code === 'RuleSetDoesNotExist') {
             await ses.createReceiptRuleSet({ RuleSetName: ruleSetName }).promise();
        } else {
            throw err;
        }
    }

    await ses.createReceiptRule({
        RuleSetName: ruleSetName,
        Rule: {
            Name: `Route-${tenantSlug}`,
            Enabled: true,
            Recipients: [customEmailIdentity],
            Actions: [
                {
                    S3Action: {
                        BucketName: bucketName,
                        ObjectKeyPrefix: `${tenantSlug}/`,
                    }
                }
            ],
            ScanEnabled: true // Enable spam/virus scanning
        }
    }).promise();

    console.log('[Phase 2] AWS SES Configured Successfully.');

    console.log('\n--- TENANT ONBOARDING COMPLETE ---');
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `Tenant ${tenantSlug} communications infrastructure provisioned.`,
        identities: {
            email: customEmailIdentity,
            mailFrom: customMailFromDomain
        }
      })
    };

  } catch (error) {
    console.error('Onboarding Service Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal Server Error', details: error.message })
    };
  }
};