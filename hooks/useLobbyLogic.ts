import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/useGameStore'
import { GameSettings } from '@/lib/types'
import { GAME_CONFIG } from '@/lib/constants/config'

export function useLobbyLogic(code: string) {
    const router = useRouter()
    const { session, setSession } = useGameStore()
    const [showAddPlayer, setShowAddPlayer] = useState(false)
    const [newPlayerName, setNewPlayerName] = useState('')

    const [roundsTotal, setRoundsTotal] = useState<number>(GAME_CONFIG.ROUNDS.DEFAULT)
    const [isProgressiveMode, setIsProgressiveMode] = useState(false)

    useEffect(() => {
        if (!session) {
            setSession({
                id: 'mock-session-id',
                roomCode: code,
                status: 'WAITING',
                settings: {
                    difficulty: 2,
                    tags: ['Fun', 'Soft'],
                    timerDuration: 180,
                    alcoholMode: true
                },
                players: [],
                isPaused: false,
                roundsTotal: GAME_CONFIG.ROUNDS.DEFAULT,
                roundsCompleted: 0,
                playersPlayedThisRound: 0,
                isProgressiveMode: false
            })
        } else {
            setRoundsTotal(session.roundsTotal)
            setIsProgressiveMode(session.isProgressiveMode)
        }
    }, [code, session, setSession])

    const handleAddPlayer = () => {
        if (!newPlayerName.trim()) return

        const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newPlayerName}`

        const newPlayer = {
            id: Math.random().toString(36).substr(2, 9),
            name: newPlayerName,
            avatar: avatar,
            score: 0,
            jokersLeft: 1,
            rerollsLeft: 1,
            exchangeLeft: 1,
            isHost: session?.players.length === 0,
            isPaused: false
        }

        if (session) {
            setSession({
                ...session,
                players: [...session.players, newPlayer]
            })
        }
        setNewPlayerName('')
        setShowAddPlayer(false)
    }

    const handleSettingsUpdate = (newSettings: GameSettings) => {
        if (session) {
            setSession({ ...session, settings: newSettings })
        }
    }

    const updateSessionExtraSettings = (rounds: number, progressive: boolean) => {
        if (session) {
            setSession({
                ...session,
                roundsTotal: rounds,
                isProgressiveMode: progressive
            })
            setRoundsTotal(rounds)
            setIsProgressiveMode(progressive)
        }
    }

    const handleDeletePlayer = (playerId: string) => {
        if (session) {
            const updatedPlayers = session.players.filter(p => p.id !== playerId)
            setSession({ ...session, players: updatedPlayers })
        }
    }

    const startGame = () => {
        if (!session || session.players.length < 2) return

        const randomPlayer = session.players[Math.floor(Math.random() * session.players.length)]

        const startDare: import('@/lib/types').Dare = {
            id: 'start',
            content: "Pour commencer : Tout le monde boit une gorgée !",
            difficultyLevel: 1,
            categoryTags: ['Fun'],
            xpReward: 10
        }

        setSession({
            ...session,
            status: 'ACTIVE',
            currentTurnPlayerId: randomPlayer.id,
            currentDare: startDare,
            roundsTotal: roundsTotal,
            isProgressiveMode: isProgressiveMode
        })

        router.push(`/game/${code}`)
    }

    const calculateTimeEstimation = () => {
        if (!session) return { min: 0, max: 0 }

        const playerCount = Math.max(session.players.length, 2)
        const rounds = roundsTotal

        // V9.1: New formula - Max Time = Players * Rounds * Level Timer
        // Level Timer: 120s (Audace), 60s (Chaos), 30s (Apocalypse)
        // We need to get the timer from DIFFICULTY_CONFIG based on current difficulty
        const difficulty = session.settings.difficulty
        // Note: DIFFICULTY_CONFIG is not imported here, need to import it or use hardcoded values if import fails.
        // Let's assume we can import it.
        const timerPerTurn = difficulty === 2 ? 120 : difficulty === 3 ? 60 : difficulty === 4 ? 30 : 0

        const totalSeconds = playerCount * rounds * timerPerTurn

        const maxMinutes = Math.ceil(totalSeconds / 60)
        const minMinutes = Math.ceil(maxMinutes / 2) // Average = Max / 2

        return { min: minMinutes, max: maxMinutes }
    }

    return {
        session,
        showAddPlayer,
        setShowAddPlayer,
        newPlayerName,
        setNewPlayerName,
        roundsTotal,
        isProgressiveMode,
        handleAddPlayer,
        handleSettingsUpdate,
        updateSessionExtraSettings,
        handleDeletePlayer,
        startGame,
        calculateTimeEstimation
    }
}
