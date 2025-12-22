import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import {
  onAuthChange,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  handleGoogleRedirectResult,
} from '@/lib/firebase/auth'

// ========================================
// ERROR TRANSLATION
// ========================================

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
  'auth/invalid-email': 'Adresse email invalide',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
  'auth/user-not-found': 'Aucun compte trouvé avec cette adresse',
  'auth/wrong-password': 'Mot de passe incorrect',
  'auth/popup-closed-by-user': 'Connexion annulée',
  'auth/popup-blocked': 'Le popup a été bloqué par le navigateur',
}

function translateAuthError(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code
    return ERROR_MESSAGES[code] || 'Une erreur est survenue'
  }
  return 'Une erreur est survenue'
}

// ========================================
// HOOK
// ========================================

interface UseAuthReturn {
  // State
  user: User | null
  loading: boolean
  error: string | null

  // Computed
  isAuthenticated: boolean
  displayName: string | null
  email: string | null
  photoURL: string | null

  // Actions
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen to auth state changes on mount (client-side only)
  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Handle Google redirect result (for mobile sign-in)
    // This is async but onAuthStateChanged will detect the user once processed
    handleGoogleRedirectResult().catch((err) => {
      console.error('Error handling Google redirect:', err)
    })

    // Listen to auth state changes - will fire when redirect is processed
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // ========================================
  // COMPUTED VALUES
  // ========================================

  const isAuthenticated = user !== null
  const displayName = user?.displayName ?? null
  const email = user?.email ?? null
  const photoURL = user?.photoURL ?? null

  // ========================================
  // ACTIONS
  // ========================================

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setError(null)
      await signInWithGoogle()
      // User state will be updated by onAuthChange listener
    } catch (err) {
      const errorMessage = translateAuthError(err)
      setError(errorMessage)
      throw err
    }
  }

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setError(null)
      await signInWithEmail(email, password)
      // User state will be updated by onAuthChange listener
    } catch (err) {
      const errorMessage = translateAuthError(err)
      setError(errorMessage)
      throw err
    }
  }

  const registerWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setError(null)
      await signUpWithEmail(email, password)
      // User state will be updated by onAuthChange listener
    } catch (err) {
      const errorMessage = translateAuthError(err)
      setError(errorMessage)
      throw err
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setError(null)
      await signOut()
      // User state will be updated by onAuthChange listener
    } catch (err) {
      const errorMessage = translateAuthError(err)
      setError(errorMessage)
      throw err
    }
  }

  const clearError = (): void => {
    setError(null)
  }

  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    displayName,
    email,
    photoURL,

    // Actions
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    clearError,
  }
}
