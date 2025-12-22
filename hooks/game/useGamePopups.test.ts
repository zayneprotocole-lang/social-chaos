/**
 * Tests for useGamePopups hook
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGamePopups } from './useGamePopups'

// Mock navigator.vibrate
const mockVibrate = vi.fn()
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
})

describe('useGamePopups', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with all popups closed', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 2, alcoholMode: false })
    )

    expect(result.current.isSentenceOpen).toBe(false)
    expect(result.current.isSuccessPopupOpen).toBe(false)
    expect(result.current.isAbandonConfirmOpen).toBe(false)
    expect(result.current.currentPenalty).toBe('')
  })

  it('should open sentence popup with penalty text', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 2, alcoholMode: true })
    )

    act(() => {
      result.current.openSentencePopup()
    })

    expect(result.current.isSentenceOpen).toBe(true)
    expect(result.current.currentPenalty).toBeTruthy()
    expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200])
  })

  it('should close sentence popup', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 2, alcoholMode: false })
    )

    act(() => {
      result.current.openSentencePopup()
      result.current.closeSentencePopup()
    })

    expect(result.current.isSentenceOpen).toBe(false)
  })

  it('should open/close success popup', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 1, alcoholMode: false })
    )

    act(() => {
      result.current.openSuccessPopup()
    })
    expect(result.current.isSuccessPopupOpen).toBe(true)

    act(() => {
      result.current.closeSuccessPopup()
    })
    expect(result.current.isSuccessPopupOpen).toBe(false)
  })

  it('should open abandon confirm and close sentence popup', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 2, alcoholMode: false })
    )

    // First open sentence popup
    act(() => {
      result.current.openSentencePopup()
    })
    expect(result.current.isSentenceOpen).toBe(true)

    // Opening abandon confirm should close sentence popup
    act(() => {
      result.current.openAbandonWithPenalty()
    })
    expect(result.current.isAbandonConfirmOpen).toBe(true)
    expect(result.current.currentPenalty).toBeTruthy()
  })

  it('should close abandon confirm', () => {
    const { result } = renderHook(() =>
      useGamePopups({ difficulty: 2, alcoholMode: false })
    )

    act(() => {
      result.current.openAbandonConfirm()
      result.current.closeAbandonConfirm()
    })

    expect(result.current.isAbandonConfirmOpen).toBe(false)
  })
})
