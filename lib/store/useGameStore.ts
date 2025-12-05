import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  // Volume settings or other global preferences can go here
  volume: number
  setVolume: (volume: number) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'social-chaos-storage',
    }
  )
)
