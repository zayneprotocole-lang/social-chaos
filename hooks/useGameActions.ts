import { useState, useCallback } from 'react'
import { Player, Dare } from '@/lib/types'
import { useSessionMutations } from '@/lib/hooks/useSessionMutations'

export function useGameActions(
  sessionId: string | undefined,
  currentPlayer: Player | undefined,
  currentDare: Dare | undefined,
  MOCK_DARES: Dare[],
  handleNextTurn: () => void
) {
  const [isSwapping, setIsSwapping] = useState(false)

  // Always call the hook - hooks must not be conditional
  const mutations = useSessionMutations(sessionId || '')

  const handleJoker = useCallback(async () => {
    if (currentPlayer && currentPlayer.jokersLeft > 0 && sessionId) {
      await mutations.decrementAttribute({
        playerId: currentPlayer.id,
        attribute: 'jokersLeft',
      })
      handleNextTurn()
    }
  }, [currentPlayer, sessionId, mutations, handleNextTurn])

  const handleReroll = useCallback(async () => {
    if (currentPlayer && currentPlayer.rerollsLeft > 0 && sessionId) {
      await mutations.decrementAttribute({
        playerId: currentPlayer.id,
        attribute: 'rerollsLeft',
      })

      const randomDare =
        MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]

      await mutations.updateGameTurn({
        currentTurnPlayerId: currentPlayer.id,
        currentDare: randomDare as unknown as Record<string, unknown>,
      })
    }
  }, [currentPlayer, sessionId, mutations, MOCK_DARES])

  const handleSwap = useCallback(() => {
    if (currentPlayer && currentPlayer.exchangeLeft > 0) {
      setIsSwapping(true)
    }
  }, [currentPlayer])

  const handlePlayerClick = useCallback(async (targetPlayerId: string) => {
    if (isSwapping && currentPlayer && sessionId && currentDare) {
      if (targetPlayerId === currentPlayer.id) return

      setIsSwapping(false)

      await mutations.decrementAttribute({
        playerId: currentPlayer.id,
        attribute: 'exchangeLeft',
      })

      await mutations.updateGameTurn({
        currentTurnPlayerId: targetPlayerId,
        currentDare: currentDare as unknown as Record<string, unknown>,
      })
    }
  }, [isSwapping, currentPlayer, sessionId, currentDare, mutations])

  return {
    isSwapping,
    setIsSwapping,
    handleJoker,
    handleReroll,
    handleSwap,
    handlePlayerClick,
  }
}
