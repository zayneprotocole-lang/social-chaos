/**
 * Tests for useGameTimer hook
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGameTimer } from './useGameTimer'

// Mock dataAccess
vi.mock('@/lib/services/dataAccess', () => ({
  dataAccess: {
    updateSession: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with timer inactive', () => {
    const { result } = renderHook(() =>
      useGameTimer({ sessionId: 'test-session', difficulty: 2 })
    )

    expect(result.current.isTimerActive).toBe(false)
  })

  it('should start timer after delay for difficulty >= 2', () => {
    const { result } = renderHook(() =>
      useGameTimer({ sessionId: 'test-session', difficulty: 2 })
    )

    act(() => {
      result.current.startTimerAfterDelay(500)
    })

    // Timer should not be active yet
    expect(result.current.isTimerActive).toBe(false)

    // Advance time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now timer should be active
    expect(result.current.isTimerActive).toBe(true)
  })

  it('should NOT start timer for difficulty < 2', () => {
    const { result } = renderHook(() =>
      useGameTimer({ sessionId: 'test-session', difficulty: 1 })
    )

    act(() => {
      result.current.startTimerAfterDelay(500)
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Timer should remain inactive for easy mode
    expect(result.current.isTimerActive).toBe(false)
  })

  it('should stop timer immediately', () => {
    const { result } = renderHook(() =>
      useGameTimer({ sessionId: 'test-session', difficulty: 3 })
    )

    // Start timer
    act(() => {
      result.current.setIsTimerActive(true)
    })
    expect(result.current.isTimerActive).toBe(true)

    // Stop timer
    act(() => {
      result.current.stopTimer()
    })
    expect(result.current.isTimerActive).toBe(false)
  })
})
