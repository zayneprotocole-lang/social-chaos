import { useState, useCallback } from 'react'
import { Player, Dare } from '@/lib/types'
import { useSessionMutations } from '@/lib/hooks/useSessionMutations'

export function useGameActions(
  sessionId: string | undefined,
  currentPlayer: Player | undefined,
  players: Player[] | undefined,
  currentDare: Dare | undefined,
  swapUsedByPlayerIds: string[] | undefined, // V9.4: Array of all players who have used swap this turn
  MOCK_DARES: Dare[],
  finishTurnAndAdvance: () => void,
  handleFastTurnTransition: (options?: { showSuccessPopup?: boolean; onAction?: () => Promise<void> | void }) => Promise<void>
) {
  const [isSwapping, setIsSwapping] = useState(false)
  const mutations = useSessionMutations(sessionId || '')

  const handleJoker = useCallback(async () => {
    if (currentPlayer && currentPlayer.jokersLeft > 0 && sessionId) {
      await handleFastTurnTransition({
        showSuccessPopup: false,
        onAction: async () => {
          await mutations.decrementAttribute({
            playerId: currentPlayer.id,
            attribute: 'jokersLeft',
          })
        }
      })
    }
  }, [currentPlayer, sessionId, mutations, handleFastTurnTransition])

  const handleReroll = useCallback(async () => {
    if (currentPlayer && currentPlayer.rerollsLeft > 0 && sessionId) {
      await mutations.decrementAttribute({
        playerId: currentPlayer.id,
        attribute: 'rerollsLeft',
      })

      const randomDare = MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]
      const { Timestamp, increment } = await import('firebase/firestore')

      await mutations.updateGameTurn({
        currentTurnPlayerId: currentPlayer.id,
        currentDare: randomDare as unknown as Record<string, unknown>,
        startedAt: Timestamp.now(),
        turnCounter: increment(1),
      })
    }
  }, [currentPlayer, sessionId, mutations, MOCK_DARES])

  const handleSwap = useCallback(() => {
    if (currentPlayer && currentPlayer.exchangeLeft > 0) {
      setIsSwapping(prev => !prev)
    }
  }, [currentPlayer])

  const handlePlayerClick = useCallback(async (targetPlayerId: string) => {
    if (isSwapping && currentPlayer && sessionId && currentDare && players) {
      // Can't swap with yourself
      if (targetPlayerId === currentPlayer.id) {
        setIsSwapping(false)
        return
      }

      // V9.4: Can't swap with ANY player who has used swap this turn
      const blockedPlayers = swapUsedByPlayerIds || []
      if (blockedPlayers.includes(targetPlayerId)) {
        console.log("🚫 Cannot swap with player who already used swap this turn:", targetPlayerId)
        return
      }

      const targetPlayer = players.find(p => p.id === targetPlayerId)
      if (!targetPlayer) return

      setIsSwapping(false)

      await mutations.decrementAttribute({
        playerId: currentPlayer.id,
        attribute: 'exchangeLeft',
      })

      await mutations.swapPlayers({
        player1: currentPlayer,
        player2: targetPlayer
      })

      const { Timestamp, increment } = await import('firebase/firestore')

      // Add current player to the list of players who have used swap
      const updatedSwapUsers = [...blockedPlayers, currentPlayer.id]

      await mutations.updateGameTurn({
        currentTurnPlayerId: targetPlayerId,
        currentDare: currentDare as unknown as Record<string, unknown>,
        startedAt: Timestamp.now(),
        turnCounter: increment(1),
        swapUsedByPlayerIds: updatedSwapUsers
      })

      console.log('🔄 Swap executed:', currentPlayer.name, '→', targetPlayer.name, '| Blocked players:', updatedSwapUsers)
    }
  }, [isSwapping, currentPlayer, sessionId, currentDare, mutations, players, swapUsedByPlayerIds])

  const handleTogglePause = useCallback(async (playerId: string, isPaused: boolean) => {
    if (!sessionId) return

    await mutations.togglePause({ playerId, isPaused })

    // If pausing the CURRENT player, skip turn immediately
    // finishTurnAndAdvance will find the next ACTIVE player automatically
    if (isPaused && playerId === currentPlayer?.id) {
      console.log("⏸️ Current player paused, skipping turn...")
      await handleFastTurnTransition({ showSuccessPopup: false })
    }
  }, [sessionId, mutations, currentPlayer, handleFastTurnTransition])

  return {
    isSwapping,
    setIsSwapping,
    handleJoker,
    handleReroll,
    handleSwap,
    handlePlayerClick,
    handleTogglePause,
  }
}
