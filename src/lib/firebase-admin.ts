import 'server-only';

import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminFirestore: Firestore | undefined;

export function getAdminFirestore() {
  if (adminFirestore) {
    return adminFirestore;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment.');
  }

  const existingApps = getApps();
  adminApp = existingApps[0] ?? initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });

  adminFirestore = getFirestore(adminApp);
  return adminFirestore;
}

export async function getLeadCount() {
  try {
    const firestore = getAdminFirestore();
    const snapshot = await firestore.collection('leads').count().get();
    return snapshot.data().count;
  } catch (error) {
    console.warn('Firebase Admin is unavailable, falling back to 0:', error);
    return 0;
  }
}
