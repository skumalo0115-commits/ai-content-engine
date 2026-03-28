import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function isFirebaseAdminConfigured() {
  const config = getFirebaseAdminConfig();
  return Boolean(config.projectId && config.clientEmail && config.privateKey);
}

const adminApp = isFirebaseAdminConfigured()
  ? getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(getFirebaseAdminConfig()),
      })
  : null;

export const adminDb = adminApp ? getFirestore(adminApp) : null;
