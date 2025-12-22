'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from 'firebase/auth'
import { logError } from '@/lib/utils/security'

// ========================================
// CONSTANTS
// ========================================

const PUBLIC_ROUTES = ['/auth', '/legal']

// ========================================
// COMPONENT
// ========================================

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  useEffect(() => {
    // Skip auth check for public routes
    if (isPublicRoute) {
      setLoading(false)
      return
    }

    // Only check auth on client-side for protected routes
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    let unsubscribeFn: (() => void) | null = null

    // Dynamically import auth functions to avoid SSR issues
    import('@/lib/firebase/auth')
      .then(({ onAuthChange, handleGoogleRedirectResult }) => {
        // Handle any pending Google redirect (for mobile)
        handleGoogleRedirectResult().catch((err) => {
          console.error('Error handling redirect in AuthGuard:', err)
        })

        // Listen to auth state - will update when redirect is processed
        unsubscribeFn = onAuthChange((currentUser) => {
          setUser(currentUser)
          setLoading(false)
        })
      })
      .catch((error) => {
        logError('Failed to initialize auth:', error)
        setLoading(false)
      })

    // Cleanup: unsubscribe from auth listener
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn()
      }
    }
  }, [isPublicRoute])

  useEffect(() => {
    // Skip if public route or still loading
    if (isPublicRoute || loading) return

    // If user is not authenticated on a protected route
    if (!user) {
      router.replace('/auth')
      return
    }
  }, [user, loading, router, isPublicRoute])

  // Public routes render immediately without auth check
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Show loader while checking authentication for protected routes
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-white/60">Chargement...</p>
      </div>
    )
  }

  // Don't render children during redirect
  if (!user) {
    return null
  }

  // Render children for authenticated users
  return <>{children}</>
}
