/**
 * Store Zustand pour l'état global de jeu
 *
 * Gère les préférences globales (volume) et la session active.
 * Persisté dans localStorage pour conserver les préférences entre sessions.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  // Volume settings or other global preferences can go here
  volume: number
  setVolume: (volume: number) => void
  activeSessionId: string | null
  activeSessionCode: string | null
  setActiveSession: (id: string | null, code: string | null) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
      activeSessionId: null,
      activeSessionCode: null,
      setActiveSession: (id, code) =>
        set({ activeSessionId: id, activeSessionCode: code }),
    }),
    {
      name: 'social-chaos-storage',
    }
  )
)
