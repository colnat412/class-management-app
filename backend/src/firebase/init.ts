import { initializeApp, getApps, cert } from 'firebase-admin/app';
import * as serviceAccount from '../firebase/firebase-adminsdk.json';

export function initializeFirebase() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount as any),
    });
    console.log('Firebase initialized');
  } else {
    console.log('Firebase already initialized');
  }
}
