import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { createRequestId, logger, serializeError } from '@/lib/logger';
import axios from 'axios';
import { normalizeCheckoutEmail, normalizeTenantSlug } from '@/lib/stripe';

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'https://hmir4kw9lg.execute-api.us-east-2.amazonaws.com/Prod/orchestrate/';
const ORCHESTRATOR_AUTH_TOKEN = process.env.ORCHESTRATOR_AUTH_TOKEN || '123456789';

function generateTemporaryPassword() {
  const random = Math.random().toString(36).slice(2);
  return `GbAi!${random}#${Date.now().toString(36)}`;
}

function getDefaultWeeklySchedule() {
  return {
    timezone: process.env.TZ || 'America/New_York',
    monday: { open: '09:00', close: '20:00', closed: false },
    tuesday: { open: '09:00', close: '20:00', closed: false },
    wednesday: { open: '09:00', close: '20:00', closed: false },
    thursday: { open: '09:00', close: '20:00', closed: false },
    friday: { open: '09:00', close: '20:00', closed: false },
    saturday: { open: '10:00', close: '14:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true },
  };
}

async function dispatchOrchestratorAction(action: string, payload: any, requestId: string) {
  const response = await axios.post(
    ORCHESTRATOR_URL,
    { action, payload },
    {
      headers: {
        Authorization: `Bearer ${ORCHESTRATOR_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        'x-request-id': requestId,
      },
    }
  );

  return {
    ...response.data,
    requestId: response.data?.requestId || requestId,
  };
}

export type CompleteCheckoutOnboardingInput = {
  email: string;
  fullName: string;
  phoneNumber: string;
  tenantSlug: string;
  planTitle?: string;
};

export type CompleteCheckoutOnboardingOptions = {
  appBaseUrl?: string;
  requestId?: string;
};

export async function completeCheckoutOnboarding(
  input: CompleteCheckoutOnboardingInput,
  options: CompleteCheckoutOnboardingOptions = {}
) {
  const requestId = options.requestId || createRequestId();

  try {
    const email = normalizeCheckoutEmail(input.email || '');
    const tenantSlug = normalizeTenantSlug(input.tenantSlug || '');
    const fullName = (input.fullName || '').trim();
    const phoneNumber = (input.phoneNumber || '').trim();
    const appBaseUrl = options.appBaseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://graciebarra.ai';

    if (!email || !tenantSlug || !fullName) {
      return { error: 'Missing required onboarding fields.', requestId };
    }

    const admin = getFirebaseAdmin();
    const db = admin.firestore();

    const slugConflict = await db
      .collection('user_profiles')
      .where('tenantSlug', '==', tenantSlug)
      .limit(1)
      .get();

    const landingConflict = await db.collection('landing_pages').doc(tenantSlug).get();

    if (!slugConflict.empty || landingConflict.exists) {
      return {
        error: `The academy slug '${tenantSlug}' is already in use.`,
        requestId,
      };
    }

    let existingUser = null;
    try {
      existingUser = await admin.auth().getUserByEmail(email);
    } catch (error: any) {
      if (error?.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    if (existingUser) {
      return {
        error: 'An account with this email already exists. Please sign in instead.',
        requestId,
      };
    }

    const temporaryPassword = generateTemporaryPassword();
    const createdUser = await admin.auth().createUser({
      email,
      password: temporaryPassword,
      displayName: fullName,
      emailVerified: false,
      disabled: false,
    });

    const onboardingPath = `/${tenantSlug}/dashboard/settings?tab=account&onboarding=1`;
    const onboardingUrl = `${appBaseUrl}${onboardingPath}`;

    const actionCodeSettings = {
      url: `${onboardingUrl}&email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    const [magicLoginLink, verifyEmailLink] = await Promise.all([
      admin.auth().generateSignInWithEmailLink(email, actionCodeSettings),
      admin.auth().generateEmailVerificationLink(email, actionCodeSettings),
    ]);

    const now = admin.firestore.FieldValue.serverTimestamp();
    const bootstrapBatch = db.batch();

    const profileRef = db.collection('user_profiles').doc(createdUser.uid);
    const landingRef = db.collection('landing_pages').doc(tenantSlug);
    const tenantRef = db.collection('tenants').doc(tenantSlug);
    const scheduleRef = db.collection('tenants').doc(tenantSlug).collection('settings').doc('schedule');

    bootstrapBatch.set(
      profileRef,
      {
        id: createdUser.uid,
        uid: createdUser.uid,
        email,
        name: fullName,
        role: 'academy_owner',
        tenantSlug,
        phoneNumber,
        onboardingCompleted: false,
        securitySetupRequired: true,
        hasPassword: true,
        googleConnected: false,
        emailVerified: false,
        schemaVersion: 1,
        bootstrapCompletedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    bootstrapBatch.set(
      landingRef,
      {
        slug: tenantSlug,
        userId: createdUser.uid,
        ownerUid: createdUser.uid,
        branchName: fullName,
        headline: `Welcome to ${fullName}`,
        isPublic: false,
        isPublished: false,
        contactPhone: phoneNumber || null,
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    bootstrapBatch.set(
      tenantRef,
      {
        slug: tenantSlug,
        ownerUid: createdUser.uid,
        status: 'active',
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    bootstrapBatch.set(
      scheduleRef,
      {
        ...getDefaultWeeklySchedule(),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    await bootstrapBatch.commit();

    let emailWarning: string | null = null;
    try {
      await dispatchOrchestratorAction(
        'SEND_EMAIL',
        {
          userEmail: email,
          templateType: 'account-created',
          userData: {
            user_name: fullName,
            company_name: tenantSlug,
            login_url: magicLoginLink,
            name: fullName,
            loginUrl: magicLoginLink,
            magic_link: magicLoginLink,
            verifyEmailUrl: verifyEmailLink,
            verify_email_url: verifyEmailLink,
            welcomeMessage: `Gracias por crear tu cuenta en graciebarra.ai para ${input.planTitle || 'tu nueva academia'}.`,
            welcome_message: 'Confirma tu email para activar todos los accesos de dashboard.',
            academySlug: tenantSlug,
            location: tenantSlug,
          },
          redirectUrl: onboardingPath,
        },
        requestId
      );
    } catch (error: any) {
      emailWarning = error?.message || 'Unable to send account email at this time.';
      logger.error('Account-created template dispatch failed', {
        requestId,
        scope: 'checkout-onboarding.completeCheckoutOnboarding',
        email,
        tenantSlug,
        error: serializeError(error),
      });
    }

    return {
      success: true,
      requestId,
      uid: createdUser.uid,
      email,
      temporaryPassword,
      redirectPath: onboardingPath,
      verifyEmailLink,
      emailWarning,
      tenantSlug,
    };
  } catch (error: any) {
    logger.error('Checkout onboarding failed', {
      requestId,
      scope: 'checkout-onboarding.completeCheckoutOnboarding',
      error: serializeError(error),
      input: {
        email: input?.email,
        tenantSlug: input?.tenantSlug,
      },
    });

    return {
      error: error?.message || 'Failed to complete checkout onboarding.',
      requestId,
    };
  }
}
