import { useMutation } from '@tanstack/react-query'
import { dataAccess } from '@/lib/services/dataAccess'
import { GameSettings, Player } from '@/lib/types'
import type { Timestamp, FieldValue } from 'firebase/firestore'

/**
 * Custom hook providing mutation functions for session-related operations.
 * Wraps dataAccess methods with React Query mutations for optimistic updates.
 */
export function useSessionMutations(sessionId: string) {
  const updateScoreMutation = useMutation({
    mutationFn: async ({
      playerId,
      score,
    }: {
      playerId: string
      score: number
    }) => {
      await dataAccess.updatePlayerScore(sessionId, playerId, score)
    },
  })

  const updateGameTurnMutation = useMutation({
    mutationFn: async (updates: {
      currentTurnPlayerId: string
      currentDare: Record<string, unknown>
      roundsCompleted?: number
      playersPlayedThisRound?: number
      startedAt?: Timestamp
      turnCounter?: FieldValue | number
      swapUsedByPlayerIds?: string[]
    }) => {
      await dataAccess.updateGameTurn(sessionId, updates)
    },
  })

  const decrementAttributeMutation = useMutation({
    mutationFn: async ({
      playerId,
      attribute,
    }: {
      playerId: string
      attribute: 'jokersLeft' | 'rerollsLeft' | 'exchangeLeft'
    }) => {
      await dataAccess.decrementPlayerAttribute(sessionId, playerId, attribute)
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: GameSettings) => {
      await dataAccess.updateSession(sessionId, { settings })
    },
  })

  const swapPlayersMutation = useMutation({
    mutationFn: async ({
      player1,
      player2,
    }: {
      player1: Player
      player2: Player
    }) => {
      await dataAccess.swapPlayersPositions(sessionId, player1, player2)
    },
  })

  const togglePauseMutation = useMutation({
    mutationFn: async ({
      playerId,
      isPaused,
    }: {
      playerId: string
      isPaused: boolean
    }) => {
      const updates: { isPaused: boolean; hasBeenPaused?: boolean } = {
        isPaused,
      }
      if (isPaused) {
        updates.hasBeenPaused = true
      }
      await dataAccess.updatePlayerStatus(sessionId, playerId, updates)
    },
  })

  return {
    updateScore: updateScoreMutation.mutateAsync,
    updateGameTurn: updateGameTurnMutation.mutateAsync,
    decrementAttribute: decrementAttributeMutation.mutateAsync,
    updateSettings: updateSettingsMutation.mutateAsync,
    swapPlayers: swapPlayersMutation.mutateAsync,
    togglePause: togglePauseMutation.mutateAsync,
  }
}
