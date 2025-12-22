/**
 * useGameFlow - Orchestrateur principal du flux de jeu
 *
 * REFACTORISÉ: Ce hook compose désormais plusieurs hooks spécialisés:
 * - useGameTimer: Gestion du timer
 * - useGameCard: État de la carte
 * - useGamePopups: Gestion des popups
 * - useGameTurn: Transitions de tour
 * - useGameHistory: Sauvegarde historique
 *
 * L'API publique reste IDENTIQUE pour ne pas casser les composants existants.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ControlStep } from '@/types'
import { Dare, GameSession } from '@/lib/types'

// Import specialized hooks
import { useGameTimer } from './game/useGameTimer'
import { useGameCard } from './game/useGameCard'
import { useGamePopups } from './game/useGamePopups'
import { useGameTurn } from './game/useGameTurn'
import { useGameHistory } from './game/useGameHistory'

export function useGameFlow(session: GameSession | null, MOCK_DARES: Dare[]) {
  // ========================================
  // GAME STATUS STATE
  // ========================================
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING'>('IDLE')
  const [controlStep, setControlStep] = useState<ControlStep>('START')
  const [isOnGoing, setIsOnGoing] = useState(false)
  const [isLocalGameFinished, setIsLocalGameFinished] = useState(false)

  // Track last processed dare ID to detect new turns
  const lastDareIdRef = useRef<string | undefined>(undefined)
  const lastTurnPlayerIdRef = useRef<string | undefined>(undefined)

  // ========================================
  // COMPOSE SPECIALIZED HOOKS
  // ========================================
  const difficulty = session?.settings.difficulty || 1
  const alcoholMode = session?.settings.alcoholMode ?? false

  // Card state
  const card = useGameCard()

  // Timer management
  const timer = useGameTimer({
    sessionId: session?.id,
    difficulty,
  })

  // Popups management
  const popups = useGamePopups({
    difficulty,
    alcoholMode,
  })

  // Turn transitions
  const turn = useGameTurn({
    session,
    dares: MOCK_DARES,
  })

  // History saving
  const history = useGameHistory({ session })

  // ========================================
  // SYNC TURN STATE WITH SESSION
  // ========================================
  useEffect(() => {
    if (!session?.currentTurnPlayerId || !session?.currentDare) return

    // Only proceed if this is a NEW DARE (different from last one)
    if (session.currentDare.id !== lastDareIdRef.current) {
      // Check if it's a re-roll (same player, new dare)
      const isReroll =
        session.currentTurnPlayerId === lastTurnPlayerIdRef.current

      // Update the refs
      lastDareIdRef.current = session.currentDare.id
      lastTurnPlayerIdRef.current = session.currentTurnPlayerId

      if (isReroll) {
        // Reroll: Keep card revealed, just update content
        card.revealCard()
        setGameStatus('PLAYING')
        setControlStep('ACTION')
      } else {
        // New Turn: Reset to IDLE state
        card.showCard()
        setGameStatus('IDLE')
        setControlStep('START')
        setIsOnGoing(false)
        timer.stopTimer()
      }
    }
  }, [session?.currentDare?.id, session?.currentTurnPlayerId, card, timer])

  // ========================================
  // CORE ACTIONS
  // ========================================

  /**
   * Player clicks "TIRER UNE CARTE" to reveal
   */
  const startTurn = useCallback(() => {
    card.revealCard()
    setGameStatus('PLAYING')
    setControlStep('ACTION')
    timer.startTimerAfterDelay(700)
  }, [card, timer])

  /**
   * Timer completed - show penalty popup
   */
  const handleTimerComplete = useCallback(() => {
    timer.stopTimer()
    popups.openSentencePopup()
  }, [timer, popups])

  /**
   * Finish current turn and advance to next player
   */
  const finishTurnAndAdvance = useCallback(async () => {
    // Reset UI state
    card.hideCard()
    setGameStatus('IDLE')
    setControlStep('START')
    timer.stopTimer()
    popups.closeSentencePopup()

    // Advance to next turn
    const result = await turn.advanceToNextTurn()

    // Check game end
    if (result.isGameEnd) {
      setIsLocalGameFinished(true)
      await history.saveGameHistory({ roundsCompleted: result.roundsCompleted })
    }
  }, [card, timer, popups, turn, history])

  /**
   * Unified Transition Handler
   * Executes data update and UI feedback in parallel
   */
  const handleFastTurnTransition = useCallback(
    async (
      options: {
        showSuccessPopup?: boolean
        onAction?: () => Promise<void> | void
      } = {}
    ) => {
      const { showSuccessPopup = false, onAction } = options

      timer.stopTimer()

      // Execute in parallel: Data Update + UI Feedback
      await Promise.all([
        // 1. Data Transition
        (async () => {
          if (onAction) await onAction()
          await finishTurnAndAdvance()
        })(),

        // 2. UI Feedback (Popup Timing)
        (async () => {
          if (showSuccessPopup) {
            await popups.showSuccessPopupWithDelay(2000)
          }
        })(),
      ])
    },
    [timer, finishTurnAndAdvance, popups]
  )

  /**
   * Validate challenge - award point and advance
   */
  const handleValidateChallenge = useCallback(
    async (currentPlayerId: string | undefined) => {
      await handleFastTurnTransition({
        showSuccessPopup: true,
        onAction: async () => {
          if (currentPlayerId) {
            await turn.awardPointToPlayer(currentPlayerId)
          }
        },
      })
    },
    [handleFastTurnTransition, turn]
  )

  /**
   * Handle success popup completion
   */
  const handleSuccessPopupComplete = useCallback(() => {
    popups.closeSuccessPopup()
  }, [popups])

  /**
   * Handle abandon button click
   */
  const handleAbandon = useCallback(() => {
    timer.stopTimer()
    timer.pauseTimerOnServer()
    popups.openAbandonWithPenalty()
  }, [timer, popups])

  /**
   * Confirm abandon - advance to next turn
   */
  const confirmAbandon = useCallback(() => {
    popups.closeAbandonConfirm()
    handleFastTurnTransition({ showSuccessPopup: false })
  }, [popups, handleFastTurnTransition])

  /**
   * Cancel abandon - resume game
   */
  const cancelAbandon = useCallback(async () => {
    popups.closeAbandonConfirm()
    await timer.restartTimerOnServer()
  }, [popups, timer])

  /**
   * Handle sentence popup next button
   */
  const handleSentenceNext = useCallback(() => {
    popups.closeSentencePopup()
    handleFastTurnTransition({ showSuccessPopup: false })
  }, [popups, handleFastTurnTransition])

  // ========================================
  // RETURN PUBLIC API (unchanged for compatibility)
  // ========================================
  return {
    // Card state
    isCardVisible: card.isCardVisible,
    isCardRevealed: card.isCardRevealed,

    // Game status
    gameStatus,
    controlStep,
    setControlStep,
    isOnGoing,
    setIsOnGoing,
    isLocalGameFinished,

    // Timer
    isTimerActive: timer.isTimerActive,
    setIsTimerActive: timer.setIsTimerActive,

    // Sentence popup
    isSentenceOpen: popups.isSentenceOpen,
    setIsSentenceOpen: popups.setIsSentenceOpen,
    currentPenalty: popups.currentPenalty,

    // Abandon popup
    isAbandonConfirmOpen: popups.isAbandonConfirmOpen,

    // Success popup
    isSuccessPopupOpen: popups.isSuccessPopupOpen,
    handleSuccessPopupComplete,

    // Actions
    startTurn,
    handleTimerComplete,
    finishTurnAndAdvance,
    handleValidateChallenge,
    handleAbandon,
    confirmAbandon,
    cancelAbandon,
    handleSentenceNext,
    handleFastTurnTransition,
  }
}
