import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { ControlStep } from '@/components/game/Controls'
import { getPenaltyText } from '@/lib/constants/sentences'
import { Dare, GameSession } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'
import { saveGameCompletion } from '@/lib/actions/historyActions'

export function useGameFlow(session: GameSession | null, MOCK_DARES: Dare[]) {
  const { } = useGameStore()

  const [isCardVisible, setIsCardVisible] = useState(false)
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING'>('IDLE')
  const [controlStep, setControlStep] = useState<ControlStep>('START')

  // Timer State
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isOnGoing, setIsOnGoing] = useState(false)

  // Sentence Popup State
  const [isSentenceOpen, setIsSentenceOpen] = useState(false)
  const [currentPenalty, setCurrentPenalty] = useState('')

  // Abandon Confirmation State
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false)

  // Sync Turn State with Session
  useEffect(() => {
    if (!session?.currentTurnPlayerId) return

    // If the turn player changes, or if it's the first load and we have a dare, reset/start the turn
    if (session.currentDare && gameStatus === 'IDLE') {
      // Schedule state updates via callback to avoid setState in effect
      // We use a small timeout to ensure this runs after the render cycle, 
      // but ideally this logic should be event-driven. 
      // Given the constraints, we merge the logic here to avoid the second cascading effect.
      const timerId = setTimeout(() => {
        setIsCardVisible(true)
        setGameStatus('PLAYING')
        setControlStep('START')
        setIsOnGoing(false)

        const difficulty = session.settings.difficulty || 1
        // Logic merged from the previous cascading effect:
        if (difficulty >= 2) {
          setIsTimerActive(true)
          setControlStep('ACTION')
        } else {
          // Difficulty 1 logic
          setControlStep('ACTION')
          setIsTimerActive(false)
        }
      }, 0)
      return () => clearTimeout(timerId)
    }
  }, [
    session?.currentTurnPlayerId,
    session?.currentDare,
    gameStatus,
    session?.settings.difficulty,
  ])

  const startTurn = useCallback(() => {
    // Manual start (fallback or for first turn if needed)
    setIsCardVisible(true)
    setGameStatus('PLAYING')
    setControlStep('START')
    setIsOnGoing(false)

    const difficulty = session?.settings.difficulty || 1
    if (difficulty === 1) {
      setControlStep('ACTION')
      setIsTimerActive(false)
    }
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

  const handleNextTurn = useCallback(async () => {
    setIsCardVisible(false)
    setGameStatus('IDLE')
    setControlStep('START')
    setIsTimerActive(false)
    setIsSentenceOpen(false)

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
      if (roundsCompleted >= (session.roundsTotal || 10)) {
        // Game Over Logic
        const sortedPlayers = [...session.players].sort(
          (a, b) => b.score - a.score
        )
        const winner = sortedPlayers[0]
        const loser = sortedPlayers[sortedPlayers.length - 1]

        const difficultyLabel =
          DIFFICULTY_CONFIG[session.settings.difficulty]?.name || 'Inconnu'

        // Use Server Action for secure completion
        await saveGameCompletion(session.id, {
          winnerName: winner.name,
          loserName: loser.name,
          roundsPlayed: roundsCompleted,
          difficultyLabel: difficultyLabel,
        })

        // We don't update the turn if the game is finished
        return
      }

      await dataAccess.updateGameTurn(session.id, {
        currentTurnPlayerId: nextPlayer.id,
        currentDare: randomDare as unknown as Record<string, unknown>,
        playersPlayedThisRound: playersPlayed,
        roundsCompleted: roundsCompleted,
      })
    }
  }, [session, MOCK_DARES])

  const handleValidateChallenge = useCallback(async (
    currentPlayerId: string | undefined
  ) => {
    // Award point to current player for completing the challenge
    if (currentPlayerId && session) {
      // Atomic increment
      await dataAccess.updatePlayerScore(
        session.id,
        currentPlayerId,
        (session.players.find((p) => p.id === currentPlayerId)?.score || 0) + 1
      )
    }
    handleNextTurn()
  }, [session, handleNextTurn])

  const handleAbandon = useCallback(() => {
    setIsTimerActive(false) // Stop the timer
    setIsAbandonConfirmOpen(true)
  }, [])

  const confirmAbandon = useCallback(() => {
    setIsAbandonConfirmOpen(false)
    openSentencePopup()
  }, [openSentencePopup])

  const cancelAbandon = useCallback(() => {
    setIsAbandonConfirmOpen(false)
  }, [])

  const handleSentenceNext = useCallback(() => {
    setIsSentenceOpen(false)
    handleNextTurn()
  }, [handleNextTurn])

  return {
    isCardVisible,
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
    startTurn,
    handleTimerComplete,
    handleNextTurn,
    handleValidateChallenge,
    handleAbandon,
    confirmAbandon,
    cancelAbandon,
    handleSentenceNext,
  }
}
