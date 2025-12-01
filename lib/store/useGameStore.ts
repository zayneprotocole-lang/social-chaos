import { create } from 'zustand'
import { GameSession, Player, Dare, DifficultyLevel } from '../types'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'

interface GameState {
  session: GameSession | null
  currentUser: Player | null
  isLoading: boolean

  // Actions
  setSession: (
    session: GameSession | ((prev: GameSession | null) => GameSession | null)
  ) => void
  setCurrentUser: (user: Player) => void
  updatePlayerScore: (playerId: string, points: number) => void
  useJoker: (playerId: string) => void
  useReroll: (playerId: string, nextDare: Dare) => void
  useSwap: (initiatorId: string, targetPlayerId: string) => void
  nextTurn: (nextPlayerId: string, nextDare: Dare) => void
  togglePlayerPause: (playerId: string) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  session: null,
  currentUser: null,
  isLoading: false,

  setSession: (sessionOrFn) =>
    set((state) => {
      const newSession =
        typeof sessionOrFn === 'function'
          ? sessionOrFn(state.session)
          : sessionOrFn
      return { session: newSession }
    }),
  setCurrentUser: (user) => set({ currentUser: user }),

  updatePlayerScore: (playerId, points) =>
    set((state) => {
      if (!state.session) return {}
      const updatedPlayers = state.session.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      )
      return { session: { ...state.session, players: updatedPlayers } }
    }),

  useJoker: (playerId) =>
    set((state) => {
      if (!state.session) return {}
      const updatedPlayers = state.session.players.map((p) => {
        if (p.id !== playerId) return p
        if (p.jokersLeft <= 0) return p
        return { ...p, jokersLeft: p.jokersLeft - 1 }
      })
      return { session: { ...state.session, players: updatedPlayers } }
    }),

  useReroll: (playerId: string, nextDare: Dare) =>
    set((state) => {
      if (!state.session) return {}
      const updatedPlayers = state.session.players.map((p) => {
        if (p.id !== playerId) return p
        if (p.rerollsLeft <= 0) return p
        return { ...p, rerollsLeft: p.rerollsLeft - 1 }
      })
      return {
        session: {
          ...state.session,
          players: updatedPlayers,
          currentDare: nextDare,
        },
      }
    }),

  useSwap: (initiatorId: string, targetPlayerId: string) =>
    set((state) => {
      if (!state.session) return {}

      const players = [...state.session.players]
      const initiatorIndex = players.findIndex((p) => p.id === initiatorId)
      const targetIndex = players.findIndex((p) => p.id === targetPlayerId)

      if (initiatorIndex === -1 || targetIndex === -1) return {}

      if (players[initiatorIndex].exchangeLeft <= 0) return {}

      players[initiatorIndex] = {
        ...players[initiatorIndex],
        exchangeLeft: players[initiatorIndex].exchangeLeft - 1,
      }

      const temp = players[initiatorIndex]
      players[initiatorIndex] = players[targetIndex]
      players[targetIndex] = temp

      return {
        session: {
          ...state.session,
          players: players,
          currentTurnPlayerId: targetPlayerId,
        },
      }
    }),

  nextTurn: (nextPlayerId, nextDare) =>
    set((state) => {
      if (!state.session) return {}

      const newSession = { ...state.session }

      newSession.playersPlayedThisRound =
        (newSession.playersPlayedThisRound || 0) + 1

      const activePlayersCount = newSession.players.filter(
        (p) => !p.isPaused
      ).length

      if (newSession.playersPlayedThisRound >= activePlayersCount) {
        newSession.roundsCompleted += 1
        newSession.playersPlayedThisRound = 0

        if (
          newSession.isProgressiveMode &&
          newSession.roundsCompleted > 0 &&
          newSession.roundsCompleted % 2 === 0
        ) {
          if (newSession.settings.difficulty < 4) {
            const nextDifficulty = (newSession.settings.difficulty +
              1) as DifficultyLevel
            newSession.settings.difficulty = nextDifficulty
            // V8.0 timer durations
            if (DIFFICULTY_CONFIG[nextDifficulty]) {
              newSession.settings.timerDuration =
                DIFFICULTY_CONFIG[nextDifficulty].timer
            }
          }
        }
      }

      return {
        session: {
          ...newSession,
          currentTurnPlayerId: nextPlayerId,
          currentDare: nextDare,
        },
      }
    }),

  togglePlayerPause: (playerId) =>
    set((state) => {
      if (!state.session) return {}
      const updatedPlayers = state.session.players.map((p) =>
        p.id === playerId ? { ...p, isPaused: !p.isPaused } : p
      )
      return { session: { ...state.session, players: updatedPlayers } }
    }),

  resetGame: () => set({ session: null, currentUser: null }),
}))
