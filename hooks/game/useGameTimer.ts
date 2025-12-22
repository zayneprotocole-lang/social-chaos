/**
 * useGameTimer - Gestion du timer de jeu
 *
 * Responsabilités:
 * - État du timer (actif/inactif)
 * - Démarrage/pause du timer
 * - Synchronisation avec le serveur
 */

import { useState, useCallback } from 'react'
import { dataAccess } from '@/lib/services/dataAccess'

interface UseGameTimerProps {
  sessionId: string | undefined
  difficulty: number
}

interface UseGameTimerReturn {
  isTimerActive: boolean
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>
  startTimerAfterDelay: (delayMs?: number) => void
  stopTimer: () => void
  pauseTimerOnServer: () => Promise<void>
  restartTimerOnServer: () => Promise<void>
}

export function useGameTimer({
  sessionId,
  difficulty,
}: UseGameTimerProps): UseGameTimerReturn {
  const [isTimerActive, setIsTimerActive] = useState(false)

  /**
   * Start timer after a delay (e.g., after card flip animation)
   * Only starts if difficulty >= 2
   */
  const startTimerAfterDelay = useCallback(
    (delayMs: number = 700) => {
      setTimeout(() => {
        if (difficulty >= 2) {
          setIsTimerActive(true)
        }
      }, delayMs)
    },
    [difficulty]
  )

  /**
   * Stop timer immediately (local state only)
   */
  const stopTimer = useCallback(() => {
    setIsTimerActive(false)
  }, [])

  /**
   * Pause timer on server (set startedAt to null)
   */
  const pauseTimerOnServer = useCallback(async () => {
    if (!sessionId) return
    await dataAccess.updateSession(sessionId, {
      startedAt: null,
    })
  }, [sessionId])

  /**
   * Restart timer on server (set startedAt to now)
   */
  const restartTimerOnServer = useCallback(async () => {
    if (!sessionId) return
    const { Timestamp } = await import('firebase/firestore')
    await dataAccess.updateSession(sessionId, {
      startedAt: Timestamp.now(),
    })
    setIsTimerActive(true)
  }, [sessionId])

  return {
    isTimerActive,
    setIsTimerActive,
    startTimerAfterDelay,
    stopTimer,
    pauseTimerOnServer,
    restartTimerOnServer,
  }
}
