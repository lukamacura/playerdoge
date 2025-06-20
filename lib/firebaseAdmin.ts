// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app'

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

export const firebaseAdmin = getApps().length
  ? undefined
  : initializeApp({
      credential: cert(serviceAccount as {
  projectId: string;
  privateKey: string;
  clientEmail: string;
})
,
})
