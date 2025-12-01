import { useState } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { Player, Dare } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'

export function useGameActions(
  currentPlayer: Player | undefined,
  MOCK_DARES: Dare[],
  handleNextTurn: () => void
) {
  const { session } = useGameStore()
  const [isSwapping, setIsSwapping] = useState(false)

  const handleJoker = async () => {
    if (currentPlayer && currentPlayer.jokersLeft > 0 && session) {
      // Optimistic update or wait for DB?
      // For better UX, we might want optimistic, but requirements say "Direct updates".
      // We'll fire the DB call. The listener will update the UI.
      await dataAccess.decrementPlayerAttribute(
        session.id,
        currentPlayer.id,
        'jokersLeft'
      )
      handleNextTurn()
    }
  }

  const handleReroll = async () => {
    if (currentPlayer && currentPlayer.rerollsLeft > 0 && session) {
      // 1. Decrement reroll
      await dataAccess.decrementPlayerAttribute(
        session.id,
        currentPlayer.id,
        'rerollsLeft'
      )

      // 2. Pick new dare (locally for now, ideally cloud function)
      const randomDare =
        MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]

      // 3. Update game turn with new dare (keeping same player)
      await dataAccess.updateGameTurn(session.id, {
        currentTurnPlayerId: currentPlayer.id,
        currentDare: randomDare,
      })
    }
  }

  const handleSwap = () => {
    if (currentPlayer && currentPlayer.exchangeLeft > 0) {
      setIsSwapping(true)
    }
  }

  const handlePlayerClick = async (targetPlayerId: string) => {
    if (isSwapping && currentPlayer && session) {
      if (targetPlayerId === currentPlayer.id) return // Can't swap with self

      setIsSwapping(false)

      // 1. Decrement exchange
      await dataAccess.decrementPlayerAttribute(
        session.id,
        currentPlayer.id,
        'exchangeLeft'
      )

      // 2. Swap logic: Pass turn to target player
      await dataAccess.updateGameTurn(session.id, {
        currentTurnPlayerId: targetPlayerId,
        currentDare: session.currentDare!, // Keep same dare
      })
    }
  }

  return {
    isSwapping,
    setIsSwapping,
    handleJoker,
    handleReroll,
    handleSwap,
    handlePlayerClick,
  }
}
