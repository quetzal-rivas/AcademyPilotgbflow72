'use client';

import { User } from 'firebase/auth';
import { Firestore, collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

export type PostAuthResolution = {
  destination: string;
  status: 'owner-ready' | 'authenticated-no-owner' | 'student-or-other';
  tenantSlug: string | null;
};

function normalizeEmail(email?: string | null) {
  return (email || '').trim().toLowerCase();
}

export function getCheckoutDestination(preferredTenantSlug?: string | null) {
  if (preferredTenantSlug && preferredTenantSlug.length > 0) {
    const encodedSlug = encodeURIComponent(preferredTenantSlug);
    return `/${encodedSlug}/checkout?mode=admin&slug=${encodedSlug}&step=1`;
  }

  return '/checkout?mode=admin&step=1';
}

export async function resolvePostAuthDestination(
  db: Firestore,
  user: User,
  preferredTenantSlug?: string | null,
  authMode: 'admin' | 'student' = 'admin'
): Promise<PostAuthResolution> {
  const profileRef = doc(db, 'user_profiles', user.uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const profile = profileSnap.data() || {};
    const tenantSlug = typeof profile.tenantSlug === 'string' ? profile.tenantSlug : null;
    const role = typeof profile.role === 'string' ? profile.role : null;

    if (tenantSlug && (role === 'academy_owner' || role === null)) {
      return {
        destination: `/${tenantSlug}/dashboard`,
        status: 'owner-ready',
        tenantSlug,
      };
    }

    if (authMode === 'admin') {
      return {
        destination: getCheckoutDestination(preferredTenantSlug),
        status: 'authenticated-no-owner',
        tenantSlug,
      };
    }

    return {
      destination: '/dashboard',
      status: 'student-or-other',
      tenantSlug,
    };
  }

  const normalizedEmail = normalizeEmail(user.email);
  if (normalizedEmail) {
    const emailMatches = await getDocs(
      query(collection(db, 'user_profiles'), where('email', '==', normalizedEmail), limit(1))
    );

    if (!emailMatches.empty) {
      const linked = emailMatches.docs[0].data() || {};
      const tenantSlug = typeof linked.tenantSlug === 'string' ? linked.tenantSlug : null;
      const role = typeof linked.role === 'string' ? linked.role : null;

      if (tenantSlug && (role === 'academy_owner' || role === null)) {
        return {
          destination: `/${tenantSlug}/dashboard`,
          status: 'owner-ready',
          tenantSlug,
        };
      }
    }
  }

  if (authMode === 'admin') {
    return {
      destination: getCheckoutDestination(preferredTenantSlug),
      status: 'authenticated-no-owner',
      tenantSlug: preferredTenantSlug || null,
    };
  }

  return {
    destination: '/dashboard',
    status: 'student-or-other',
    tenantSlug: preferredTenantSlug || null,
  };
}
