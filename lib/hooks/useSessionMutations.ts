import { useMutation } from '@tanstack/react-query'
import { dataAccess } from '@/lib/services/dataAccess'
import { GameSettings } from '@/lib/types'

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
      startedAt?: any // Using any to avoid import issues with Timestamp in hooks
      turnCounter?: any // V9.3: Allow atomic increment
      swapUsedByPlayerIds?: string[] // V9.4: All players who used swap
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
    mutationFn: async ({ player1, player2 }: { player1: any, player2: any }) => {
      await dataAccess.swapPlayersPositions(sessionId, player1, player2)
    },
  })

  const togglePauseMutation = useMutation({
    mutationFn: async ({ playerId, isPaused }: { playerId: string; isPaused: boolean }) => {
      const updates: { isPaused: boolean; hasBeenPaused?: boolean } = { isPaused }
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
