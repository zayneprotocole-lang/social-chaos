'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EmailAuthForm } from '@/components/auth'
import { useAuth } from '@/hooks/useAuth'

// ========================================
// GOOGLE ICON COMPONENT
// ========================================

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

// ========================================
// AUTH PAGE
// ========================================

export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, authLoading, router])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { signInWithGoogle } = await import('@/lib/firebase/auth')
      await signInWithGoogle()
      // Popup will handle auth, onAuthChange will detect user and useEffect will redirect
    } catch (err) {
      console.error('Google login failed:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  const handleEmailClick = () => {
    setError(null)
    setShowEmailForm(true)
  }

  const handleAuthSuccess = () => {
    router.replace('/')
  }

  const handleBack = () => {
    setShowEmailForm(false)
    setError(null)
  }

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Chargement...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo et Tagline */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-black tracking-tight">
            <span className="text-cyan-400">SOCIAL</span>{' '}
            <span className="text-purple-400">CHAOS</span>
          </h1>
          <p className="text-base text-white/60">
            Le jeu qui détruit votre dignité.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500 bg-red-500/20 px-4 py-3">
            <p className="text-center text-sm text-red-200">{error}</p>
          </div>
        )}

        {!showEmailForm ? (
          <>
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-gray-700 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleIcon />
              <span>
                {isLoading ? 'Connexion...' : 'Continuer avec Google'}
              </span>
            </button>

            {/* Separator */}
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-sm text-white/40">ou</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Email Button */}
            <button
              onClick={handleEmailClick}
              className="glass flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
            >
              <span className="text-xl">✉️</span>
              <span>Continuer avec Email</span>
            </button>

            {/* Legal Notice */}
            <p className="mt-6 text-center text-xs text-white/40">
              En continuant, tu acceptes nos{' '}
              <Link
                href="/legal"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Conditions d&apos;utilisation
              </Link>
            </p>
          </>
        ) : (
          <EmailAuthForm onSuccess={handleAuthSuccess} onBack={handleBack} />
        )}
      </div>
    </main>
  )
}
