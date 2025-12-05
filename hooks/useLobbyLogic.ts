import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionQuery } from '@/lib/hooks/useSessionQuery'
import { useSessionMutations } from '@/lib/hooks/useSessionMutations'
import { GAME_CONFIG } from '@/lib/constants/config'
import { GameSettings, DifficultyLevel } from '@/lib/types'
import { dataAccess } from '@/lib/services/dataAccess'

import { MOCK_DARES } from '@/lib/constants/dares'

import { useQueryClient } from '@tanstack/react-query'

export function useLobbyLogic(code: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Use Query for session state
  const { session, isLoading } = useSessionQuery(code)
  // Use Mutations for updates
  const { updateSettings } = useSessionMutations(code)

  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')

  const [roundsTotal, setRoundsTotal] = useState<number>(
    GAME_CONFIG.ROUNDS.DEFAULT
  )
  const [isProgressiveMode, setIsProgressiveMode] = useState(false)

  const handleUpdateSettings = useCallback(
    async (updates: Partial<GameSettings>) => {
      if (!session) return

      const currentSettings = session.settings
      const newSettings = { ...currentSettings, ...updates }

      await updateSettings(newSettings)
    },
    [session, updateSettings]
  )

  const handleAddPlayer = useCallback(async () => {
    if (!newPlayerName.trim() || !session) return

    try {
      const playerData = {
        name: newPlayerName.trim(),
        score: 0,
        jokersLeft: 1,
        rerollsLeft: 1,
        exchangeLeft: 1,
        isHost: session.players.length === 0, // First player is host
      }

      await dataAccess.addPlayerToSession(session.id, playerData)

      setNewPlayerName('')
      setShowAddPlayer(false)
    } catch (error) {
      console.error('Error adding player:', error)
    }
  }, [newPlayerName, session])

  const handleStartGame = useCallback(async () => {
    if (!session || session.players.length < 2) return

    try {
      // First player in the list starts (not random)
      const firstPlayer = session.players[0]

      // Pick random starting dare (optional, but good for immediate start)
      const randomDare = MOCK_DARES[Math.floor(Math.random() * MOCK_DARES.length)]

      const { Timestamp } = await import('firebase/firestore')

      // Update session status to ACTIVE and initialize turn
      await dataAccess.updateSession(session.id, {
        status: 'ACTIVE',
        currentTurnPlayerId: firstPlayer.id,
        currentDare: randomDare,
        roundsCompleted: 0,
        playersPlayedThisRound: 0,
        startedAt: Timestamp.now(),
        roundsTotal: roundsTotal, // Ensure roundsTotal is synced
      })

      // Force refresh of cache before navigating
      await queryClient.invalidateQueries({ queryKey: ['session', code] })

      // Temporary delay for debugging
      await new Promise(resolve => setTimeout(resolve, 500))

      // Navigate to game
      router.push(`/game/${code}`)
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }, [session, code, router])

  const handleDifficultyChange = useCallback(
    (value: number) => {
      handleUpdateSettings({ difficulty: value as DifficultyLevel })
    },
    [handleUpdateSettings]
  )

  const handleRoundsChange = useCallback((value: number) => {
    setRoundsTotal(value)
  }, [])

  const handleProgressiveToggle = useCallback((checked: boolean) => {
    setIsProgressiveMode(checked)
  }, [])

  const handleSettingsUpdate = useCallback(
    async (updates: Partial<GameSettings>) => {
      await handleUpdateSettings(updates)
    },
    [handleUpdateSettings]
  )

  const updateSessionExtraSettings = useCallback(
    async (rounds: number, progressive: boolean) => {
      setRoundsTotal(rounds)
      setIsProgressiveMode(progressive)
      // TODO: Persist to DB if these are session fields
    },
    []
  )

  const handleDeletePlayer = useCallback(async (playerId: string) => {
    if (!session) return

    try {
      // Delete player from Firestore
      const { deleteDoc, doc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase/firestore')

      await deleteDoc(doc(db, 'sessions', session.id, 'players', playerId))
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }, [session])

  const calculateTimeEstimation = useCallback(() => {
    if (!session) return { min: 0, max: 0 }

    const playerCount = session.players.length || 2 // Minimum 2 players
    const timerDurationSeconds = session.settings?.timerDuration || 60
    const timerDurationMinutes = timerDurationSeconds / 60

    // Base overhead per turn (reading dare, deciding, transitions, etc.)
    const overheadMin = 0.5 // 30 seconds minimum overhead
    const overheadMax = 1.5 // 90 seconds maximum overhead (with discussions, actions)

    // Total time per turn = timer duration + overhead
    const minTimePerTurn = timerDurationMinutes + overheadMin
    const maxTimePerTurn = timerDurationMinutes + overheadMax

    // Total time = rounds × players × timePerTurn
    return {
      min: Math.round(roundsTotal * playerCount * minTimePerTurn),
      max: Math.round(roundsTotal * playerCount * maxTimePerTurn),
    }
  }, [session, roundsTotal])

  return {
    session,
    isLoading,
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
    startGame: handleStartGame,
    calculateTimeEstimation,
  }
}
