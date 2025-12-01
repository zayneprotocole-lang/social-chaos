import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { ControlStep } from '@/components/game/Controls'
import { getPenaltyText } from '@/lib/constants/sentences'
import { Dare, GameSession } from '@/lib/types'

export function useGameFlow(
    session: GameSession | null,
    MOCK_DARES: Dare[]
) {
    const { nextTurn, updatePlayerScore } = useGameStore()

    const [isCardVisible, setIsCardVisible] = useState(false)
    const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING'>('IDLE')
    const [controlStep, setControlStep] = useState<ControlStep>('START')

    // Timer State
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [isOnGoing, setIsOnGoing] = useState(false)

    // Sentence Popup State
    const [isSentenceOpen, setIsSentenceOpen] = useState(false)
    const [currentPenalty, setCurrentPenalty] = useState("")

    // Abandon Confirmation State
    const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false)

    // Auto-start timer effect
    useEffect(() => {
        if (isCardVisible && !isTimerActive && gameStatus === 'PLAYING') {
            const difficulty = session?.settings.difficulty || 1
            if (difficulty >= 2 && !isOnGoing) {
                // Immediate start
                setIsTimerActive(true)
                setControlStep('ACTION')
            }
        }
    }, [isCardVisible, gameStatus, session?.settings.difficulty, isOnGoing, isTimerActive])

    const startTurn = () => {
        setIsCardVisible(true)
        setGameStatus('PLAYING')
        setControlStep('START') // Start at START to show 5s delay
        setIsOnGoing(false) // Reset En Cours state

        const difficulty = session?.settings.difficulty || 1
        if (difficulty === 1) {
            setControlStep('ACTION')
            setIsTimerActive(false) // No timer for lvl 1
        }
    }

    const openSentencePopup = () => {
        if (!session) return
        setIsAbandonConfirmOpen(false) // Close abandon confirm if open (e.g. timer ran out)
        const penalty = getPenaltyText(session.settings.difficulty, session.settings.alcoholMode ?? false)
        setCurrentPenalty(penalty)
        setIsSentenceOpen(true)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    }

    const handleTimerComplete = () => {
        setIsTimerActive(false)
        openSentencePopup()
    }

    const handleNextTurn = () => {
        setIsCardVisible(false)
        setGameStatus('IDLE')
        setControlStep('START')
        setIsTimerActive(false)
        setIsSentenceOpen(false)

        // Pick next player
        if (session) {
            let currentIndex = session.players.findIndex(p => p.id === session.currentTurnPlayerId)
            let nextIndex = currentIndex
            let attempts = 0

            // Find next non-paused player
            do {
                nextIndex = (nextIndex + 1) % session.players.length
                attempts++
            } while (session.players[nextIndex].isPaused && attempts < session.players.length)

            const nextPlayer = session.players[nextIndex]

            // Pick random dare
            const randomDare = MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]

            nextTurn(nextPlayer.id, randomDare)
        }
    }

    const handleValidateChallenge = (currentPlayerId: string | undefined) => {
        // Award point to current player for completing the challenge
        if (currentPlayerId) {
            updatePlayerScore(currentPlayerId, 1)
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
        handleSentenceNext
    }
}
