import { useState, useEffect, useCallback, useRef } from 'react'
import { ControlStep } from '@/components/game/Controls'
import { getPenaltyText } from '@/lib/constants/sentences'
import { Dare, GameSession } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'


export function useGameFlow(session: GameSession | null, MOCK_DARES: Dare[]) {

  const [isCardVisible, setIsCardVisible] = useState(false)
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING'>('IDLE')
  const [controlStep, setControlStep] = useState<ControlStep>('START')

  // Timer State
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isOnGoing, setIsOnGoing] = useState(false)
  const [isCardRevealed, setIsCardRevealed] = useState(false) // Track if card animation completed

  // Sentence Popup State
  const [isSentenceOpen, setIsSentenceOpen] = useState(false)
  const [currentPenalty, setCurrentPenalty] = useState('')

  // Success Popup State
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)

  // Abandon Confirmation State
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false)

  // Track last processed dare ID to detect new turns
  const lastDareIdRef = useRef<string | undefined>(undefined)
  const lastTurnPlayerIdRef = useRef<string | undefined>(undefined)

  // Track if game is finished locally (for immediate UI update)
  const [isLocalGameFinished, setIsLocalGameFinished] = useState(false)

  // Sync Turn State with Session - Prepare for card draw
  // Only triggers when the DARE changes (new turn), not when player changes (swap)
  useEffect(() => {
    if (!session?.currentTurnPlayerId || !session?.currentDare) return

    // Only proceed if this is a NEW DARE (different from last one)
    // This prevents swap from triggering a new card draw
    if (session.currentDare.id !== lastDareIdRef.current) {

      // Check if it's a re-roll (same player, new dare)
      const isReroll = session.currentTurnPlayerId === lastTurnPlayerIdRef.current

      // Update the refs
      lastDareIdRef.current = session.currentDare.id
      lastTurnPlayerIdRef.current = session.currentTurnPlayerId

      if (isReroll) {
        // Reroll: Keep card revealed, just update content (handled by React)
        // Maybe add a small flash effect later if needed
        console.log('🎲 Reroll detected - Keeping card revealed')
        setIsCardRevealed(true)
        setGameStatus('PLAYING')
        setControlStep('ACTION')
      } else {
        // New Turn: Reset to IDLE state - player must click to draw card
        setIsCardVisible(true)        // Show card (face down)
        setIsCardRevealed(false)      // Not revealed yet
        setGameStatus('IDLE')         // Waiting for player to draw
        setControlStep('START')       // Draw phase
        setIsOnGoing(false)
        setIsTimerActive(false)
      }
    }
  }, [
    session?.currentDare?.id,  // Only react to dare ID changes
    session?.currentTurnPlayerId // Need player ID to detect reroll
  ])

  // Player clicks "TIRER UNE CARTE" to reveal
  const startTurn = useCallback(() => {
    // Reveal the card (flip animation)
    setIsCardRevealed(true)
    setGameStatus('PLAYING')
    setControlStep('ACTION')

    // Start timer after card flip animation completes (600ms)
    const difficulty = session?.settings.difficulty || 1
    setTimeout(() => {
      if (difficulty >= 2) {
        setIsTimerActive(true)
      }
    }, 700)
  }, [session?.settings.difficulty])

  const openSentencePopup = useCallback(() => {
    if (!session) return
    setIsAbandonConfirmOpen(false) // Close abandon confirm if open (e.g. timer ran out)
    const penalty = getPenaltyText(
      session.settings.difficulty,
      session.settings.alcoholMode ?? false
    )
    setCurrentPenalty(penalty)
    setIsSentenceOpen(true)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  }, [session])

  const handleTimerComplete = useCallback(() => {
    setIsTimerActive(false)
    openSentencePopup()
  }, [openSentencePopup])

  const pauseTimerOnServer = useCallback(async () => {
    if (!session) return
    // Set startedAt to null to indicate timer is paused/stopped on server
    await dataAccess.updateSession(session.id, {
      startedAt: null
    } as any) // Type assertion needed until SessionDocument type is updated to allow null
  }, [session])

  const finishTurnAndAdvance = useCallback(async () => {
    setIsCardVisible(false)
    setIsCardRevealed(false)
    setGameStatus('IDLE')
    setControlStep('START')
    setIsTimerActive(false)
    setIsSentenceOpen(false)
    // setIsSuccessPopupOpen(false) // Handled by handleFastTurnTransition now

    // Pick next player
    if (session) {
      const currentIndex = session.players.findIndex(
        (p) => p.id === session.currentTurnPlayerId
      )
      let nextIndex = currentIndex
      let attempts = 0

      // Find next non-paused player
      do {
        nextIndex = (nextIndex + 1) % session.players.length
        attempts++
      } while (
        session.players[nextIndex].isPaused &&
        attempts < session.players.length
      )

      const nextPlayer = session.players[nextIndex]

      // Pick random dare
      const randomDare =
        MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]

      // Update Firestore
      const activePlayersCount = session.players.filter(
        (p) => !p.isPaused
      ).length
      let playersPlayed = (session.playersPlayedThisRound || 0) + 1
      let roundsCompleted = session.roundsCompleted

      if (playersPlayed >= activePlayersCount) {
        roundsCompleted += 1
        playersPlayed = 0
      }

      // CHECK GAME END CONDITION
      const roundsTotal = Number(session.roundsTotal) || 10

      console.log('Checking Game End:', {
        roundsCompleted,
        roundsTotal,
        playersPlayed,
        activePlayersCount,
        condition: roundsCompleted >= roundsTotal
      })

      if (roundsCompleted >= roundsTotal) {
        console.log('🎮 Game End Condition Met! Saving completion...')

        // Set local finished state FIRST for immediate UI update
        setIsLocalGameFinished(true)

        // Game Over Logic with Tiebreaker
        // Tiebreaker: If scores are equal, player with MORE remaining action cards wins
        // (fewer actions used = played better without needing crutches)
        const getActionsRemaining = (player: typeof session.players[0]) =>
          (player.jokersLeft || 0) + (player.rerollsLeft || 0) + (player.exchangeLeft || 0)

        const sortedPlayers = [...session.players].sort((a, b) => {
          // Primary: Higher score wins
          if (b.score !== a.score) {
            return b.score - a.score
          }
          // Tiebreaker: More actions remaining = better (used fewer)
          return getActionsRemaining(b) - getActionsRemaining(a)
        })

        const winner = sortedPlayers[0]
        const loser = sortedPlayers[sortedPlayers.length - 1]

        console.log('🏆 Final Rankings:', sortedPlayers.map(p => ({
          name: p.name,
          score: p.score,
          actionsRemaining: getActionsRemaining(p)
        })))

        const difficultyLabel =
          DIFFICULTY_CONFIG[session.settings.difficulty]?.name || 'Inconnu'

        try {
          // 1. PRIORITY: Save to Local Storage FIRST (Offline-First / Guaranteed)
          console.log('💾 Saving to localStorage...')
          const { localHistory } = await import('@/lib/services/historyStorage')
          localHistory.save({
            winner: {
              id: winner.id,
              name: winner.name,
              avatar: winner.avatar,
              score: winner.score
            },
            loser: {
              id: loser.id,
              name: loser.name,
              avatar: loser.avatar,
              score: loser.score
            },
            otherPlayers: sortedPlayers
              .filter(p => p.id !== winner.id && p.id !== loser.id)
              .map(p => ({ name: p.name, avatar: p.avatar })),
            totalRounds: roundsCompleted,
            difficulty: session.settings.difficulty,
            categories: session.settings.tags,
            playedAt: Date.now()
          })
          console.log('✅ LocalHistory saved successfully!')
        } catch (localError) {
          console.error('❌ Failed to save to localStorage:', localError)
        }

        // 2. OPTIONAL: Save to Firestore (may fail, that's OK)
        try {
          const { Timestamp } = await import('firebase/firestore')

          await dataAccess.saveGameHistory({
            winner: {
              id: winner.id,
              name: winner.name,
              avatar: winner.avatar,
              score: winner.score
            },
            loser: {
              id: loser.id,
              name: loser.name,
              avatar: loser.avatar,
              score: loser.score
            },
            otherPlayers: sortedPlayers
              .filter(p => p.id !== winner.id && p.id !== loser.id)
              .map(p => ({ name: p.name, avatar: p.avatar })),
            totalRounds: roundsCompleted,
            difficulty: session.settings.difficulty,
            categories: session.settings.tags,
            playedAt: Timestamp.now()
          })

          // 3. Mark Session as Finished
          await dataAccess.archiveGameSession(session.id, {
            winnerName: winner.name,
            loserName: loser.name,
            roundsPlayed: roundsCompleted,
            difficultyLabel: difficultyLabel,
          })

          console.log('✅ Firestore history saved successfully!')
        } catch (firestoreError) {
          console.error('⚠️ Firestore save failed (localStorage still saved):', firestoreError)
        }

        // Don't update the turn if the game is finished
        // The UI will show GameEndScreen based on isLocalGameFinished or session.status
        return
      }

      const { Timestamp, increment } = await import('firebase/firestore')

      await dataAccess.updateGameTurn(session.id, {
        currentTurnPlayerId: nextPlayer.id,
        currentDare: randomDare as unknown as Record<string, unknown>,
        playersPlayedThisRound: playersPlayed,
        roundsCompleted: roundsCompleted,
        startedAt: Timestamp.now(), // Atomic Timer Reset
        turnCounter: increment(1), // V9.3: Atomic increment to force timer remount
        swapUsedByPlayerIds: [], // V9.4: Reset swap block for new turn
      })
    }
  }, [session, MOCK_DARES])

  /**
   * Unified Transition Handler
   * Executes data update and UI feedback in parallel for instant feel
   */
  const handleFastTurnTransition = useCallback(async (
    options: {
      showSuccessPopup?: boolean
      onAction?: () => Promise<void> | void
    } = {}
  ) => {
    const { showSuccessPopup = false, onAction } = options // Default to false

    setIsTimerActive(false) // Stop timer immediately

    // Execute in parallel: Data Update + UI Feedback
    await Promise.all([
      // 1. Data Transition (Optimistic/Async)
      (async () => {
        if (onAction) await onAction()
        await finishTurnAndAdvance()
      })(),

      // 2. UI Feedback (Popup Timing)
      (async () => {
        if (showSuccessPopup) {
          setIsSuccessPopupOpen(true)
          // Force exactly 2s duration for the popup (user can dismiss early)
          await new Promise(resolve => setTimeout(resolve, 2000))
          setIsSuccessPopupOpen(false)
        }
      })()
    ])
  }, [finishTurnAndAdvance])

  const handleValidateChallenge = useCallback(async (
    currentPlayerId: string | undefined
  ) => {
    await handleFastTurnTransition({
      showSuccessPopup: true,
      onAction: async () => {
        // Award point to current player
        if (currentPlayerId && session) {
          await dataAccess.updatePlayerScore(
            session.id,
            currentPlayerId,
            (session.players.find((p) => p.id === currentPlayerId)?.score || 0) + 1
          )
        }
      }
    })
  }, [session, handleFastTurnTransition])

  const handleSuccessPopupComplete = useCallback(() => {
    setIsSuccessPopupOpen(false)
  }, [])

  const handleAbandon = useCallback(() => {
    setIsTimerActive(false) // Stop local timer
    pauseTimerOnServer() // Stop server timer

    // Generate penalty text immediately for the overlay
    if (session) {
      const penalty = getPenaltyText(
        session.settings.difficulty,
        session.settings.alcoholMode ?? false
      )
      setCurrentPenalty(penalty)
    }

    setIsAbandonConfirmOpen(true)
  }, [pauseTimerOnServer, session])

  const confirmAbandon = useCallback(() => {
    setIsAbandonConfirmOpen(false)
    // Directly advance to next turn (sentence was already displayed in overlay)
    handleFastTurnTransition({ showSuccessPopup: false })
  }, [handleFastTurnTransition])

  const cancelAbandon = useCallback(async () => {
    setIsAbandonConfirmOpen(false)
    // Resume timer if needed (optional, for now we just close modal)
    // Ideally we should restore the timer but that requires complex logic
    // For V9.2, we assume cancel abandon continues where we left off or requires manual resume
    // But since we paused it on server, we should probably restart it or let "En Cours" handle it
    // For simplicity in this stabilization phase:
    if (session) {
      const { Timestamp } = await import('firebase/firestore')
      // Restart timer from now (simplification) or just leave it paused until "En Cours" is clicked
      // Let's restart it to avoid stuck state
      await dataAccess.updateSession(session.id, {
        startedAt: Timestamp.now()
      } as any)
      setIsTimerActive(true)
    }
  }, [session])

  const handleSentenceNext = useCallback(() => {
    setIsSentenceOpen(false)
    // Sentence = penalty accepted, no success popup (transition silently)
    handleFastTurnTransition({ showSuccessPopup: false })
  }, [handleFastTurnTransition])

  return {
    isCardVisible,
    isCardRevealed,
    gameStatus,
    controlStep,
    setControlStep,
    isSentenceOpen,
    setIsSentenceOpen,
    currentPenalty,
    isAbandonConfirmOpen,
    isTimerActive,
    setIsTimerActive,
    isOnGoing,
    setIsOnGoing,
    isSuccessPopupOpen,
    handleSuccessPopupComplete,
    isLocalGameFinished,
    startTurn,
    handleTimerComplete,
    finishTurnAndAdvance,
    handleValidateChallenge,
    handleAbandon,
    confirmAbandon,
    cancelAbandon,
    handleSentenceNext,
    handleFastTurnTransition, // Export for external use (e.g. Joker)
  }
}
