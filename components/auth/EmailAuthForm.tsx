'use client'

import { useState, FormEvent } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  logError,
  isValidEmail,
} from '@/lib/utils/security'

// ========================================
// TYPES
// ========================================

interface EmailAuthFormProps {
  onSuccess: () => void
  onBack: () => void
}

type AuthMode = 'login' | 'register'

// ========================================
// ERROR TRANSLATION
// ========================================

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
  'auth/invalid-email': 'Adresse email invalide',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 8 caractères',
  'auth/user-not-found': 'Aucun compte trouvé avec cette adresse',
  'auth/wrong-password': 'Mot de passe incorrect',
  'auth/invalid-credential': 'Email ou mot de passe incorrect',
  'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard',
}

function translateAuthError(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code
    return ERROR_MESSAGES[code] || 'Une erreur est survenue'
  }
  return 'Une erreur est survenue'
}

// ========================================
// COMPONENT
// ========================================

export function EmailAuthForm({ onSuccess, onBack }: EmailAuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Validation
  const validateForm = (): boolean => {
    // Email validation
    if (!email.trim()) {
      setError("L'email est requis")
      return false
    }
    if (!isValidEmail(email)) {
      setError('Adresse email invalide')
      return false
    }

    // Password validation
    if (!password) {
      setError('Le mot de passe est requis')
      return false
    }

    // Register mode validations - stronger password requirements
    if (mode === 'register') {
      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères')
        return false
      }

      // Au moins une minuscule
      if (!/[a-z]/.test(password)) {
        setError('Le mot de passe doit contenir au moins une minuscule')
        return false
      }

      // Au moins une majuscule
      if (!/[A-Z]/.test(password)) {
        setError('Le mot de passe doit contenir au moins une majuscule')
        return false
      }

      // Au moins un chiffre
      if (!/[0-9]/.test(password)) {
        setError('Le mot de passe doit contenir au moins un chiffre')
        return false
      }

      // Au moins un caractère spécial
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError(
          'Le mot de passe doit contenir au moins un caractère spécial (!@#$%...)'
        )
        return false
      }

      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Vérifier rate limiting (mode login uniquement pour éviter abus)
    if (mode === 'login') {
      const rateCheck = checkRateLimit('login-attempt')
      if (!rateCheck.allowed) {
        setError(
          `Trop de tentatives. Réessayez dans ${rateCheck.remainingSeconds}s`
        )
        return
      }
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Dynamic import to load Firebase only when needed
      const authModule = await import('@/lib/firebase/auth')

      if (mode === 'login') {
        await authModule.signInWithEmail(email, password)
        // Reset rate limit on success
        resetRateLimit('login-attempt')
      } else {
        await authModule.signUpWithEmail(email, password)
      }

      // Success - call onSuccess callback
      onSuccess()
    } catch (err) {
      logError('Auth error:', err)
      const errorMessage = translateAuthError(err)
      setError(errorMessage)

      // Enregistrer l'échec pour rate limiting (login seulement)
      if (mode === 'login') {
        const result = recordFailedAttempt('login-attempt', 5, 60000)
        if (result.locked) {
          setError(
            `Trop de tentatives échouées. Veuillez patienter ${result.remainingSeconds}s`
          )
        }
      }

      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError(null)
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="glass w-full rounded-2xl p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Retour</span>
      </button>

      {/* Title */}
      <h2 className="mb-6 text-2xl font-bold text-white">
        {mode === 'login' ? 'Connexion' : 'Créer un compte'}
      </h2>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 px-4 py-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-white/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="glass w-full rounded-xl px-4 py-3 text-white transition-all placeholder:text-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-white/80"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass w-full rounded-xl px-4 py-3 pr-12 text-white transition-all placeholder:text-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              disabled={isLoading}
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password (Register only) */}
        {mode === 'register' && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm text-white/80"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="glass w-full rounded-xl px-4 py-3 pr-12 text-white transition-all placeholder:text-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-right hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? 'Chargement...'
            : mode === 'login'
              ? 'Se connecter'
              : 'Créer un compte'}
        </button>

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            {mode === 'login'
              ? 'Pas encore de compte ? Créer un compte'
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </form>
    </div>
  )
}
