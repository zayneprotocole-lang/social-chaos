/**
 * useGamePopups - Gestion de tous les popups du jeu
 *
 * Responsabilités:
 * - Popup de sentence (pénalité)
 * - Popup de succès
 * - Popup de confirmation d'abandon
 * - Génération du texte de pénalité
 */

import { useState, useCallback } from 'react'
import { getPenaltyText } from '@/lib/constants/sentences'

interface UseGamePopupsProps {
  difficulty: number
  alcoholMode: boolean
}

interface UseGamePopupsReturn {
  // Sentence Popup
  isSentenceOpen: boolean
  setIsSentenceOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentPenalty: string
  openSentencePopup: () => void
  closeSentencePopup: () => void

  // Success Popup
  isSuccessPopupOpen: boolean
  openSuccessPopup: () => void
  closeSuccessPopup: () => void
  showSuccessPopupWithDelay: (durationMs?: number) => Promise<void>

  // Abandon Confirmation
  isAbandonConfirmOpen: boolean
  openAbandonConfirm: () => void
  closeAbandonConfirm: () => void
  openAbandonWithPenalty: () => void
}

export function useGamePopups({
  difficulty,
  alcoholMode,
}: UseGamePopupsProps): UseGamePopupsReturn {
  // Sentence Popup State
  const [isSentenceOpen, setIsSentenceOpen] = useState(false)
  const [currentPenalty, setCurrentPenalty] = useState('')

  // Success Popup State
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)

  // Abandon Confirmation State
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false)

  // ========================================
  // Sentence Popup
  // ========================================

  const openSentencePopup = useCallback(() => {
    setIsAbandonConfirmOpen(false) // Close abandon confirm if open
    const penalty = getPenaltyText(difficulty, alcoholMode)
    setCurrentPenalty(penalty)
    setIsSentenceOpen(true)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  }, [difficulty, alcoholMode])

  const closeSentencePopup = useCallback(() => {
    setIsSentenceOpen(false)
  }, [])

  // ========================================
  // Success Popup
  // ========================================

  const openSuccessPopup = useCallback(() => {
    setIsSuccessPopupOpen(true)
  }, [])

  const closeSuccessPopup = useCallback(() => {
    setIsSuccessPopupOpen(false)
  }, [])

  /**
   * Show success popup for a specific duration, then auto-close
   */
  const showSuccessPopupWithDelay = useCallback(
    async (durationMs: number = 2000) => {
      setIsSuccessPopupOpen(true)
      await new Promise((resolve) => setTimeout(resolve, durationMs))
      setIsSuccessPopupOpen(false)
    },
    []
  )

  // ========================================
  // Abandon Confirmation
  // ========================================

  const openAbandonConfirm = useCallback(() => {
    setIsAbandonConfirmOpen(true)
  }, [])

  const closeAbandonConfirm = useCallback(() => {
    setIsAbandonConfirmOpen(false)
  }, [])

  /**
   * Open abandon confirmation with penalty text pre-generated
   */
  const openAbandonWithPenalty = useCallback(() => {
    const penalty = getPenaltyText(difficulty, alcoholMode)
    setCurrentPenalty(penalty)
    setIsAbandonConfirmOpen(true)
  }, [difficulty, alcoholMode])

  return {
    // Sentence
    isSentenceOpen,
    setIsSentenceOpen,
    currentPenalty,
    openSentencePopup,
    closeSentencePopup,

    // Success
    isSuccessPopupOpen,
    openSuccessPopup,
    closeSuccessPopup,
    showSuccessPopupWithDelay,

    // Abandon
    isAbandonConfirmOpen,
    openAbandonConfirm,
    closeAbandonConfirm,
    openAbandonWithPenalty,
  }
}
