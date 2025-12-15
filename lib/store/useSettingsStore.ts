/**
 * Store Zustand pour les préférences utilisateur globales
 *
 * Gère les paramètres d'interface (langue, mode daltonien).
 * Persisté dans localStorage pour conserver entre les sessions.
 *
 * Actions principales :
 * - setLanguage: Change la langue de l'application (fr/en)
 * - toggleColorblindMode: Active/désactive le mode daltonien
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'fr' | 'en'

interface SettingsState {
  language: Language
  colorblindMode: boolean

  setLanguage: (language: Language) => void
  toggleColorblindMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'fr',
      colorblindMode: false,

      setLanguage: (language) => set({ language }),

      toggleColorblindMode: () =>
        set((state) => ({
          colorblindMode: !state.colorblindMode,
        })),
    }),
    {
      name: 'social-chaos-settings',
    }
  )
)
