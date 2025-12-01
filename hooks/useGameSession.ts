import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/useGameStore'
import { Dare } from '@/lib/types'

// Mock Dares for demo (moved from page.tsx)
const MOCK_DARES: Dare[] = [
    { id: '1', content: "Fais 10 pompes ou bois 2 gorgées.", difficultyLevel: 1, categoryTags: ["Soft"], xpReward: 10 },
    { id: '2', content: "Raconte ta pire honte.", difficultyLevel: 2, categoryTags: ["Humiliant"], xpReward: 20 },
    { id: '3', content: "Envoie un SMS à ton ex.", difficultyLevel: 4, categoryTags: ["Chaos"], xpReward: 50 },
    { id: '4', content: "Danse sans musique pendant 1 minute.", difficultyLevel: 2, categoryTags: ["Fun"], xpReward: 15 },
]

export function useGameSession(roomId: string) {
    const { session, setSession, currentUser } = useGameStore()

    useEffect(() => {
        if (!session) {
            setSession({
                id: 'mock-session',
                roomCode: roomId,
                status: 'ACTIVE',
                settings: { difficulty: 2, tags: ['Fun'], timerDuration: 180, alcoholMode: true },
                players: [
                    { id: 'p1', name: 'Alex', score: 0, jokersLeft: 1, rerollsLeft: 1, exchangeLeft: 1, isHost: true, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex', isPaused: false },
                    { id: 'p2', name: 'Sam', score: 0, jokersLeft: 1, rerollsLeft: 1, exchangeLeft: 1, isHost: false, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam', isPaused: false },
                    { id: 'p3', name: 'Julie', score: 0, jokersLeft: 1, rerollsLeft: 1, exchangeLeft: 1, isHost: false, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Julie', isPaused: false },
                ],
                currentTurnPlayerId: 'p1',
                currentDare: MOCK_DARES[0],
                isPaused: false,
                roundsTotal: 6,
                roundsCompleted: 0,
                playersPlayedThisRound: 0,
                isProgressiveMode: false
            })
        }
    }, [session, setSession, roomId])

    const currentPlayer = session?.players.find(p => p.id === session.currentTurnPlayerId)
    const isMyTurn = currentUser?.id === currentPlayer?.id || true // Debug: always true for demo
    const isGameFinished = session ? session.roundsCompleted >= session.roundsTotal && session.roundsTotal > 0 : false

    return {
        session,
        currentPlayer,
        isMyTurn,
        isGameFinished,
        MOCK_DARES // Exporting this so other hooks can use it if needed, or just for consistency
    }
}
