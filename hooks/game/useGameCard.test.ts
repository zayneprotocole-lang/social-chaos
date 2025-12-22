/**
 * Tests for useGameCard hook
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useGameCard } from './useGameCard'

describe('useGameCard', () => {
  it('should initialize with card hidden', () => {
    const { result } = renderHook(() => useGameCard())

    expect(result.current.isCardVisible).toBe(false)
    expect(result.current.isCardRevealed).toBe(false)
  })

  it('should show card (face down)', () => {
    const { result } = renderHook(() => useGameCard())

    act(() => {
      result.current.showCard()
    })

    expect(result.current.isCardVisible).toBe(true)
    expect(result.current.isCardRevealed).toBe(false)
  })

  it('should reveal card (flip)', () => {
    const { result } = renderHook(() => useGameCard())

    act(() => {
      result.current.showCard()
      result.current.revealCard()
    })

    expect(result.current.isCardVisible).toBe(true)
    expect(result.current.isCardRevealed).toBe(true)
  })

  it('should hide card completely', () => {
    const { result } = renderHook(() => useGameCard())

    act(() => {
      result.current.showCard()
      result.current.revealCard()
      result.current.hideCard()
    })

    expect(result.current.isCardVisible).toBe(false)
    expect(result.current.isCardRevealed).toBe(false)
  })

  it('should reset card to initial visible state', () => {
    const { result } = renderHook(() => useGameCard())

    act(() => {
      result.current.showCard()
      result.current.revealCard()
      result.current.resetCard()
    })

    expect(result.current.isCardVisible).toBe(true)
    expect(result.current.isCardRevealed).toBe(false)
  })
})
