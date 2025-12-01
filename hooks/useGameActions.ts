import { useState } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { Player, Dare } from '@/lib/types'

export function useGameActions(
    currentPlayer: Player | undefined,
    MOCK_DARES: Dare[],
    handleNextTurn: () => void
) {
    const { useJoker, useReroll, useSwap } = useGameStore()
    const [isSwapping, setIsSwapping] = useState(false)

    const handleJoker = () => {
        if (currentPlayer && currentPlayer.jokersLeft > 0) {
            useJoker(currentPlayer.id)
            // Joker skips the turn essentially, so we move to next
            handleNextTurn()
        }
    }

    const handleReroll = () => {
        if (currentPlayer && currentPlayer.rerollsLeft > 0) {
            const randomDare = MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]
            useReroll(currentPlayer.id, randomDare)
        }
    }

    const handleSwap = () => {
        if (currentPlayer && currentPlayer.exchangeLeft > 0) {
            setIsSwapping(true)
        }
    }

    const handlePlayerClick = (targetPlayerId: string) => {
        if (isSwapping && currentPlayer) {
            if (targetPlayerId === currentPlayer.id) return // Can't swap with self

            setIsSwapping(false)

            // Swap logic: Pass the turn/dare to the target player
            // In this game, "Swap" usually means "You do this dare instead of me"
            // So we just call nextTurn with the target player and the SAME dare.
            // V7.0 Update: Swap action now swaps the players in the turn order.
            // The store handles the swap. We just need to trigger it.
            useSwap(currentPlayer.id, targetPlayerId)

            // Note: useSwap in store updates currentTurnPlayerId to targetPlayerId
            // so the UI will update automatically.
        }
    }

    return {
        isSwapping,
        setIsSwapping,
        handleJoker,
        handleReroll,
        handleSwap,
        handlePlayerClick
    }
}
