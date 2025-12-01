import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { ControlStep } from '@/components/game/Controls'
import { getPenaltyText } from '@/lib/constants/sentences'
import { Dare, GameSession } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'
import { saveGameCompletion } from '@/lib/actions/historyActions'

export function useGameFlow(session: GameSession | null, MOCK_DARES: Dare[]) {
  const {} = useGameStore()

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

  // Auto-start timer effect
  useEffect(() => {
    if (isCardVisible && !isTimerActive && gameStatus === 'PLAYING') {
      const difficulty = session?.settings.difficulty || 1
      if (difficulty >= 2 && !isOnGoing) {
        // Schedule state update via callback
        const timerId = setTimeout(() => {
          setIsTimerActive(true)
          setControlStep('ACTION')
        }, 0)
        return () => clearTimeout(timerId)
      }
    }
  }, [
    isCardVisible,
    gameStatus,
    session?.settings.difficulty,
    isOnGoing,
    isTimerActive,
  ])

  // Sync Turn State with Session
  useEffect(() => {
    if (!session?.currentTurnPlayerId) return

    // If the turn player changes, or if it's the first load and we have a dare, reset/start the turn
    if (session.currentDare && gameStatus === 'IDLE') {
      // Schedule state updates via callback to avoid setState in effect
      const timerId = setTimeout(() => {
        setIsCardVisible(true)
        setGameStatus('PLAYING')
        setControlStep('START')
        setIsOnGoing(false)

        // If difficulty 1, skip timer
        if ((session.settings.difficulty || 1) === 1) {
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

  const startTurn = () => {
    // Manual start (fallback or for first turn if needed)
    // In real-time mode, this might trigger the "Next Turn" logic if we are in a "Waiting to Start" state
    // But currently handleNextTurn does the setup.
    // If we are IDLE, we just show the card.
    setIsCardVisible(true)
    setGameStatus('PLAYING')
    setControlStep('START')
    setIsOnGoing(false)

    const difficulty = session?.settings.difficulty || 1
    if (difficulty === 1) {
      setControlStep('ACTION')
      setIsTimerActive(false)
    }
  }

  const openSentencePopup = () => {
    if (!session) return
    setIsAbandonConfirmOpen(false) // Close abandon confirm if open (e.g. timer ran out)
    const penalty = getPenaltyText(
      session.settings.difficulty,
      session.settings.alcoholMode ?? false
    )
    setCurrentPenalty(penalty)
    setIsSentenceOpen(true)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  }

  const handleTimerComplete = () => {
    setIsTimerActive(false)
    openSentencePopup()
  }

  const handleNextTurn = async () => {
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
      // We need to handle round increment logic here or in dataAccess
      // For now, let's do it here to keep logic visible

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
  }

  const handleValidateChallenge = async (
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
      // Ideally we use increment(1) but the dataAccess method might need update to support it or we just read-modify-write for now
      // dataAccess.updatePlayerScore takes a number. Let's check if we can improve it later.
    }
    handleNextTurn()
  }

  const handleAbandon = () => {
    setIsTimerActive(false) // Stop the timer
    setIsAbandonConfirmOpen(true)
  }

  const confirmAbandon = () => {
    setIsAbandonConfirmOpen(false)
    openSentencePopup()
  }

  const cancelAbandon = () => {
    setIsAbandonConfirmOpen(false)
  }

  const handleSentenceNext = () => {
    setIsSentenceOpen(false)
    handleNextTurn()
  }

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
