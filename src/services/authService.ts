import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export function getAdminEmails(): string[] {
  const envVal = import.meta.env.VITE_ADMIN_EMAILS || '';
  return envVal
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const adminEmails = getAdminEmails();
  const userEmailNorm = user.email.toLowerCase();

  // If VITE_ADMIN_EMAILS list is defined, check if user's email matches any listed email
  if (adminEmails.length > 0) {
    const isMatched = adminEmails.some((e) => e === userEmailNorm);
    if (isMatched) return true;
  }

  // Fallback: Any account manually created by the owner in Firebase Console (since public signup is disabled) is an authorized admin
  return true;
}

export async function loginAdmin(email: string, pass: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase credentials are not configured on Vercel. Please add VITE_FIREBASE_* environment variables in Vercel Dashboard Settings.');
  }

  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const user = credential.user;
  if (!isUserAdmin(user)) {
    await signOut(auth);
    throw new Error('Unauthorized account. Your email is not in the authorized admin allowlist.');
  }
  return user;
}

export async function logoutAdmin(): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  }
}

export function subscribeToAuth(callback: (user: User | null, isAdmin: boolean) => void) {
  if (!isFirebaseConfigured) {
    callback(null, false);
    return () => {};
  }

  try {
    return onAuthStateChanged(
      auth,
      (user) => {
        const adminState = isUserAdmin(user);
        callback(user, adminState);
      },
      (error) => {
        console.warn('Firebase auth state listener error:', error);
        callback(null, false);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firebase Auth:', err);
    callback(null, false);
    return () => {};
  }
}
