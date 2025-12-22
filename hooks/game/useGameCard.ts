/**
 * useGameCard - Gestion de l'état de la carte de défi
 *
 * Responsabilités:
 * - Visibilité de la carte
 * - Animation de révélation
 * - Reset de l'état
 */

import { useState, useCallback } from 'react'

interface UseGameCardReturn {
  isCardVisible: boolean
  isCardRevealed: boolean
  showCard: () => void
  revealCard: () => void
  hideCard: () => void
  resetCard: () => void
}

export function useGameCard(): UseGameCardReturn {
  const [isCardVisible, setIsCardVisible] = useState(false)
  const [isCardRevealed, setIsCardRevealed] = useState(false)

  /**
   * Show card (face down, ready to be drawn)
   */
  const showCard = useCallback(() => {
    setIsCardVisible(true)
    setIsCardRevealed(false)
  }, [])

  /**
   * Reveal the card (flip animation)
   */
  const revealCard = useCallback(() => {
    setIsCardRevealed(true)
  }, [])

  /**
   * Hide card completely
   */
  const hideCard = useCallback(() => {
    setIsCardVisible(false)
    setIsCardRevealed(false)
  }, [])

  /**
   * Reset card to initial state (visible but not revealed)
   */
  const resetCard = useCallback(() => {
    setIsCardVisible(true)
    setIsCardRevealed(false)
  }, [])

  return {
    isCardVisible,
    isCardRevealed,
    showCard,
    revealCard,
    hideCard,
    resetCard,
  }
}
