'use client'

import { motion } from 'framer-motion'

/**
 * Skeleton UI for Game Page
 * Task 7.3: Instant Shell Interface for game loading
 */
export default function GameSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen flex-col bg-gradient-to-b from-purple-900/20 via-black to-black"
    >
      {/* Options Menu Skeleton - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-muted/20 h-10 w-10 animate-pulse rounded-full" />
      </div>

      {/* Game Progress Skeleton */}
      <div className="flex items-center justify-center gap-4 p-4">
        <div className="bg-muted/20 h-6 w-32 animate-pulse rounded" />
      </div>

      {/* Player List Sidebar Skeleton */}
      <div className="border-border bg-background/80 fixed top-0 right-0 h-full w-48 border-l p-4 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="bg-muted/20 h-6 w-24 animate-pulse rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/5 flex items-center gap-2 rounded-lg p-3"
              >
                <div className="bg-muted/20 h-8 w-8 animate-pulse rounded-full" />
                <div className="bg-muted/10 h-4 flex-1 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative flex flex-1 flex-col items-center justify-center space-y-6 p-4 pr-56">
        {/* Turn Indicator Skeleton */}
        <div className="bg-muted/20 h-12 w-64 animate-pulse rounded-xl" />

        {/* Timer Skeleton */}
        <div className="bg-muted/20 h-16 w-full max-w-md animate-pulse rounded-xl" />

        {/* Card Skeleton */}
        <div className="border-primary/20 from-primary/5 to-secondary/5 relative h-96 w-full max-w-md animate-pulse rounded-2xl border-2 bg-gradient-to-br shadow-2xl" />

        {/* Action Buttons Skeleton */}
        <div className="flex w-full max-w-md gap-4">
          <div className="bg-muted/20 h-14 flex-1 animate-pulse rounded-lg" />
          <div className="bg-muted/20 h-14 flex-1 animate-pulse rounded-lg" />
        </div>
      </div>
    </motion.div>
  )
}
