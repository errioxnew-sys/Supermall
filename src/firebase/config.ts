import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
// If firestoreDatabaseId is defined in config, pass it, otherwise default db
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Configure Google Provider with Drive Scope
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token store for Google Drive API calls
let inMemoryAccessToken: string | null = null;

export const setCachedAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getCachedAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

// Validate Connection to Firestore as per skill requirements
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or checking connection.');
    }
  }
}
