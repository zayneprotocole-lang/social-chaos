import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionQuery } from '@/lib/hooks/useSessionQuery'
import { useSessionMutations } from '@/lib/hooks/useSessionMutations'
import { GAME_CONFIG } from '@/lib/constants/config'
import { GameSettings, DifficultyLevel } from '@/lib/types'

export function useLobbyLogic(code: string) {
  const router = useRouter()
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
    // Placeholder for adding player logic
    setNewPlayerName('')
    setShowAddPlayer(false)
  }, [newPlayerName, session])

  const handleStartGame = useCallback(async () => {
    if (!session) return
    // Navigate to game
    router.push(`/game/${code}`)
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
    // Placeholder for delete player
    console.log('Delete player', playerId)
  }, [])

  const calculateTimeEstimation = useCallback(() => {
    if (!session) return { min: 0, max: 0 }
    // Estimation: 2-4 mins per round
    return {
      min: roundsTotal * 2,
      max: roundsTotal * 4,
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
