'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface GameTimerProps {
  duration: number // Total duration in seconds
  onComplete: () => void
  isActive: boolean
  isGolden?: boolean // V9.1: Golden mode when timer is paused
}

export default function GameTimer({
  duration,
  onComplete,
  isActive,
  isGolden = false,
}: GameTimerProps) {
  const [progress, setProgress] = useState(100)

  // Timer countdown logic with pause support
  useEffect(() => {
    if (duration <= 0) {
      return
    }

    if (!isActive) {
      // Paused - keep current progress
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrementPerTick = 100 / (duration * 10) // 100ms interval = 10 ticks per second
        const newProgress = prev - decrementPerTick

        if (newProgress <= 0) {
          clearInterval(interval)
          onComplete()
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, duration, onComplete])

  if (duration <= 0) return null

  const remainingSeconds = Math.ceil((progress / 100) * duration)
  const progressPercent = progress

  // 3-stage color system based on progress
  const getColors = () => {
    if (isGolden) {
      return {
        bar: 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]',
        text: 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
        border: 'border-amber-500/40',
      }
    }
    if (progressPercent < 20) {
      // Critical - Red with pulse and intense glow
      return {
        bar: 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]',
        text: 'text-red-500 animate-pulse drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]',
        border: 'border-red-500/50',
      }
    }
    if (progressPercent < 50) {
      // Warning - Orange/Amber gradient
      return {
        bar: 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]',
        text: 'text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]',
        border: 'border-orange-500/40',
      }
    }
    // Comfortable - Cyan gradient
    return {
      bar: 'bg-gradient-to-r from-cyan-400 to-teal-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      text: 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]',
      border: 'border-cyan-500/40',
    }
  }

  const colors = getColors()

  return (
    <div className="flex flex-col items-center space-y-1">
      {/* Secondes restantes - Responsive */}
      <p
        className={cn(
          'text-center font-mono font-bold tabular-nums',
          'text-xl min-[390px]:text-2xl min-[430px]:text-3xl',
          'drop-shadow-[0_0_8px_currentColor]',
          colors.text
        )}
      >
        {remainingSeconds}s
      </p>

      {/* Barre de progression - Responsive */}
      <div
        className={cn(
          'relative h-1.5 overflow-hidden rounded-full min-[390px]:h-2',
          'w-40 min-[390px]:w-48 min-[430px]:w-56',
          'border bg-black/40',
          colors.border
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-100 ease-linear',
            'shadow-[0_0_8px_currentColor]',
            colors.bar
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
