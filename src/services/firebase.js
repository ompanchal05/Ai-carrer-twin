import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Specify the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Helper to construct Google Auth Provider with strict account selection
export function createGoogleAuthProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return provider;
}

export const googleAuthProvider = createGoogleAuthProvider();

// Non-blocking background connectivity test (Will NOT hold up app startup)
export async function testConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 2000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
  } catch (error) {
    console.debug('Firebase diagnostic note:', error?.message);
  }
}

// Run diagnostic in next tick asynchronously so it never blocks script loading
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection();
  }, 100);
}

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path = null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Note: ', JSON.stringify(errInfo));
  return null;
}

// User Profile Firestore synchronization with fast 2-second timeout (prevents 40-50s hanging)
export async function getUserProfileFromFirestore(uid, timeoutMs = 2000) {
  if (!uid) return null;
  const path = `users/${uid}`;
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, timeoutMs)
  );

  try {
    const docRef = doc(db, 'users', uid);
    const fetchPromise = getDoc(docRef).then((docSnap) => {
      if (docSnap && docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    });

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return result;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfileToFirestore(uid, userData, timeoutMs = 2500) {
  if (!uid) return false;
  const path = `users/${uid}`;
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => {
      resolve(false);
    }, timeoutMs)
  );

  try {
    const docRef = doc(db, 'users', uid);
    const payload = {
      ...userData,
      uid,
      updatedAt: new Date().toISOString()
    };
    const savePromise = setDoc(docRef, payload, { merge: true }).then(() => true);
    return await Promise.race([savePromise, timeoutPromise]);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

// Firebase Authentication Methods
export async function loginWithGoogle() {
  // Always create fresh provider with select_account prompt to guarantee account chooser
  const provider = createGoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
  // Clear any legacy un-scoped items
  try {
    localStorage.removeItem('ai_career_twin_user');
    localStorage.removeItem('ai_career_twin_auth');
    localStorage.removeItem('ai_career_twin_profile');
    localStorage.removeItem('ai_career_twin_last_parsed_resume');
  } catch {}
  return true;
}

export { onAuthStateChanged };
