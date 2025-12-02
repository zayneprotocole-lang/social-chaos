'use client'

import { motion } from 'framer-motion'

/**
 * Skeleton UI for History Page
 * Task 7.3: Instant Shell Interface for history loading
 */
export default function HistorySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-background min-h-screen space-y-6 p-4 pb-24"
    >
      {/* Header Skeleton */}
      <header className="mb-8 flex items-center gap-4">
        <div className="bg-muted/20 h-10 w-10 animate-pulse rounded-lg" />
        <div className="bg-muted/20 h-10 w-48 animate-pulse rounded-lg" />
      </header>

      {/* Grid of History Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border-border bg-card/50 space-y-4 rounded-lg border p-6 backdrop-blur-sm"
          >
            {/* Date & Time */}
            <div className="flex items-center justify-between">
              <div className="bg-muted/20 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted/10 h-4 w-16 animate-pulse rounded" />
            </div>

            {/* Difficulty & Rounds */}
            <div className="flex gap-2">
              <div className="bg-muted/20 h-6 w-20 animate-pulse rounded-full" />
              <div className="bg-muted/10 h-6 w-24 animate-pulse rounded" />
            </div>

            {/* Winner & Loser */}
            <div className="space-y-2">
              <div className="bg-muted/10 h-8 w-full animate-pulse rounded-lg" />
              <div className="bg-muted/10 h-8 w-full animate-pulse rounded-lg" />
            </div>

            {/* Expand Button */}
            <div className="bg-muted/5 h-10 w-full animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
