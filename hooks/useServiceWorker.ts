/**
 * useServiceWorker - Hook for Service Worker registration
 *
 * Handles:
 * - SW registration
 * - Update detection
 * - Install prompt management
 */

'use client'

import { useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface UseServiceWorkerReturn {
  isInstalled: boolean
  isUpdateAvailable: boolean
  isInstallable: boolean
  installApp: () => Promise<boolean>
  updateApp: () => void
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  // Register Service Worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Check if already installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)

    // Register SW
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('✅ Service Worker registered')
        setRegistration(reg)

        // Check for updates periodically
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New SW installed, update available
              console.log('🔄 New version available')
              setIsUpdateAvailable(true)
            }
          })
        })
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error)
      })

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      console.log('📲 Install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
      console.log('✅ App installed')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Install the app
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      console.warn('No install prompt available')
      return false
    }

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice

      if (outcome === 'accepted') {
        setInstallPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Install failed:', error)
      return false
    }
  }, [installPrompt])

  // Update the app (skip waiting)
  const updateApp = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }, [registration])

  return {
    isInstalled,
    isUpdateAvailable,
    isInstallable: !!installPrompt,
    installApp,
    updateApp,
  }
}
