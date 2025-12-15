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

            toggleColorblindMode: () => set((state) => ({
                colorblindMode: !state.colorblindMode
            })),
        }),
        {
            name: 'social-chaos-settings',
        }
    )
)
