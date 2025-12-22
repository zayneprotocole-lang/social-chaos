import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendEmailVerification,
  Auth,
  User,
  UserCredential,
} from 'firebase/auth'
import { getFirebaseApp } from '@/lib/firebase-client'

let _auth: Auth | null = null

/**
 * Get Firebase Auth instance (client-side only, lazy initialization)
 */
export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth should only be accessed on the client side')
  }

  if (_auth) {
    return _auth
  }

  _auth = getAuth(getFirebaseApp())
  return _auth
}

/**
 * @deprecated Use getAuthInstance() instead for SSR-safe access
 * Kept for backward compatibility
 */
export const auth =
  typeof window !== 'undefined'
    ? getAuth(getFirebaseApp())
    : (null as unknown as Auth)

// ========================================
// AUTHENTICATION METHODS
// ========================================

/**
 * Detect if current device is mobile
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Sign in with Google
 * Uses popup first (more reliable), falls back to redirect if popup is blocked
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  try {
    const authInstance = getAuthInstance()
    const provider = new GoogleAuthProvider()

    // Force account selection every time
    provider.setCustomParameters({
      prompt: 'select_account',
    })

    // Try popup first - it's more reliable than redirect
    try {
      const result = await signInWithPopup(authInstance, provider)
      return result
    } catch (popupError: unknown) {
      // If popup was blocked or closed, try redirect as fallback
      const errorCode = (popupError as { code?: string })?.code
      if (
        errorCode === 'auth/popup-blocked' ||
        errorCode === 'auth/popup-closed-by-user'
      ) {
        console.log('Popup blocked or closed, trying redirect...')
        await signInWithRedirect(authInstance, provider)
        return null
      }
      throw popupError
    }
  } catch (error) {
    console.error('Failed to sign in with Google:', error)
    throw error
  }
}

/**
 * Handle Google redirect result (call this on app initialization)
 * Returns the UserCredential if a redirect sign-in was completed, null otherwise
 */
export async function handleGoogleRedirectResult(): Promise<UserCredential | null> {
  try {
    const authInstance = getAuthInstance()
    const result = await getRedirectResult(authInstance)
    return result
  } catch (error) {
    console.error('Failed to handle Google redirect result:', error)
    throw error
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const authInstance = getAuthInstance()
    const result = await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    )
    return result
  } catch (error) {
    console.error('Failed to sign in with email:', error)
    throw error
  }
}

/**
 * Sign up with Email and Password (create new account)
 * Sends email verification after successful signup
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const authInstance = getAuthInstance()
    const result = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    )

    // Send email verification
    await sendEmailVerification(result.user)

    return result
  } catch (error) {
    console.error('Failed to sign up with email:', error)
    throw error
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    const authInstance = getAuthInstance()
    await firebaseSignOut(authInstance)
  } catch (error) {
    console.error('Failed to sign out:', error)
    throw error
  }
}

// ========================================
// AUTH STATE MANAGEMENT
// ========================================

/**
 * Listen to auth state changes
 * @param callback Function called when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthChange(
  callback: (user: User | null) => void
): () => void {
  const authInstance = getAuthInstance()
  return onAuthStateChanged(authInstance, callback)
}

/**
 * Get current authenticated user
 * @returns Current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  const authInstance = getAuthInstance()
  return authInstance.currentUser
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

/**
 * Get current user ID (uid)
 */
export function getUserId(): string | null {
  return getCurrentUser()?.uid ?? null
}

/**
 * Get current user email
 */
export function getUserEmail(): string | null {
  return getCurrentUser()?.email ?? null
}

/**
 * Get current user display name
 */
export function getUserDisplayName(): string | null {
  return getCurrentUser()?.displayName ?? null
}

/**
 * Get current user photo URL
 */
export function getUserPhotoURL(): string | null {
  return getCurrentUser()?.photoURL ?? null
}
