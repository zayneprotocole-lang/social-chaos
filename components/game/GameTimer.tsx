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

    // V9.1: Golden color when "En Cours" mode is active (paused)
    const barColor = isGolden
        ? 'bg-yellow-500 shadow-yellow-500'
        : progressPercent < 30 ? 'bg-red-500 shadow-red-500' : 'bg-primary shadow-primary'
    const textColor = isGolden
        ? 'text-yellow-500'
        : progressPercent < 30 ? 'text-red-500 animate-pulse' : 'text-white'

    return (
        <div className="w-full space-y-2">
            <div className="relative h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/20">
                <div
                    className={cn(
                        "h-full transition-all duration-100 ease-linear shadow-[0_0_10px_currentColor]",
                        barColor
                    )}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <p className={cn(
                "text-center font-mono font-bold text-4xl tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                textColor
            )}>
                {remainingSeconds} secondes
            </p>
        </div>
    )
}
