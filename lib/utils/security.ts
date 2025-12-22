/**
 * Utilitaires pour la sécurité et la validation
 */

// ========================================
// LOGGING CONDITIONNEL
// ========================================

const isDev = process.env.NODE_ENV === 'development'

/**
 * Logger d'erreurs conditionnel - affiche détails en dev, masque en production
 */
export function logError(message: string, error?: unknown): void {
  if (isDev) {
    console.error(message, error)
  } else {
    // En production, logger seulement le message sans détails sensibles
    console.error(message)
    // TODO: Envoyer à un service de logging (Sentry, LogRocket, etc.)
  }
}

/**
 * Logger d'informations conditionnel
 */
export function logInfo(message: string, data?: unknown): void {
  if (isDev) {
    console.log(message, data)
  }
}

// ========================================
// TIMEOUT POUR PROMISES
// ========================================

/**
 * Ajoute un timeout à une Promise
 * @param promise Promise à wrapper
 * @param ms Timeout en millisecondes
 * @returns Promise avec timeout
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), ms)
    ),
  ])
}

// ========================================
// VALIDATION EMAIL RENFORCÉE
// ========================================

/**
 * Valide un email avec une regex plus stricte
 */
export function isValidEmail(email: string): boolean {
  // Regex plus stricte que la validation de base
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// ========================================
// RATE LIMITING CLIENT-SIDE
// ========================================

interface RateLimitState {
  count: number
  lockoutUntil: number | null
}

const rateLimitStore = new Map<string, RateLimitState>()

/**
 * Vérifie si une action est rate-limitée
 * @param key Clé unique pour l'action (ex: 'login-attempt')
 * @returns { allowed: boolean, remainingSeconds?: number }
 */
export function checkRateLimit(key: string): {
  allowed: boolean
  remainingSeconds?: number
} {
  const now = Date.now()
  const state = rateLimitStore.get(key) || { count: 0, lockoutUntil: null }

  // Vérifier si toujours en lockout
  if (state.lockoutUntil && now < state.lockoutUntil) {
    const remainingSeconds = Math.ceil((state.lockoutUntil - now) / 1000)
    return { allowed: false, remainingSeconds }
  }

  // Reset si lockout expiré
  if (state.lockoutUntil && now >= state.lockoutUntil) {
    state.count = 0
    state.lockoutUntil = null
  }

  return { allowed: true }
}

/**
 * Enregistre une tentative échouée
 * @param key Clé unique pour l'action
 * @param maxAttempts Nombre max de tentatives avant lockout
 * @param lockoutMs Durée du lockout en ms
 * @returns { locked: boolean, remainingSeconds?: number }
 */
export function recordFailedAttempt(
  key: string,
  maxAttempts: number,
  lockoutMs: number
): { locked: boolean; remainingSeconds?: number } {
  const state = rateLimitStore.get(key) || { count: 0, lockoutUntil: null }
  state.count += 1

  if (state.count >= maxAttempts) {
    state.lockoutUntil = Date.now() + lockoutMs
    const remainingSeconds = Math.ceil(lockoutMs / 1000)
    rateLimitStore.set(key, state)
    return { locked: true, remainingSeconds }
  }

  rateLimitStore.set(key, state)
  return { locked: false }
}

/**
 * Reset le rate limit pour une clé
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}
