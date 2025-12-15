/**
 * Store Zustand pour l'état global de chargement
 *
 * Gère l'affichage de l'écran de chargement avec message optionnel.
 * Bloque le scroll du body pendant le chargement.
 * Non persisté (état temporaire en mémoire).
 *
 * Actions principales :
 * - show: Affiche l'écran de chargement avec message optionnel
 * - hide: Masque l'écran de chargement
 */

import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  message: string | null

  // Show loading screen with optional message
  show: (message?: string) => void

  // Hide loading screen
  hide: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: null,

  show: (message?: string) => {
    // Prevent body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
    set({ isLoading: true, message: message || null })
  },

  hide: () => {
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
    set({ isLoading: false, message: null })
  },
}))
