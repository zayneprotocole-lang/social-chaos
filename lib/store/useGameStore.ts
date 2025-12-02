import { create } from 'zustand'
import { Player } from '../types'

interface GameState {
  currentUser: Player | null

  // Actions
  setCurrentUser: (user: Player) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  resetGame: () => set({ currentUser: null }),
}))
