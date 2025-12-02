'use client'

import { motion } from 'framer-motion'

/**
 * Skeleton UI for Lobby Page
 * Task 7.3: Instant Shell Interface
 * Displays immediately while data is loading, creating perception of speed
 */
export default function LobbySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-background min-h-screen space-y-6 p-4 pb-24"
    >
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="bg-muted/20 h-12 w-64 animate-pulse rounded-lg" />
        <div className="bg-muted/10 h-6 w-48 animate-pulse rounded-lg" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Duration Card Skeleton */}
          <div className="border-border bg-card/50 space-y-4 rounded-lg border p-6 backdrop-blur-sm">
            <div className="bg-muted/20 h-6 w-32 animate-pulse rounded" />
            <div className="bg-muted/10 h-24 w-full animate-pulse rounded-lg" />
            <div className="flex gap-4">
              <div className="bg-muted/10 h-10 flex-1 animate-pulse rounded" />
              <div className="bg-muted/10 h-10 flex-1 animate-pulse rounded" />
            </div>
          </div>

          {/* Player List Skeleton */}
          <div className="border-border bg-card/50 space-y-4 rounded-lg border p-6 backdrop-blur-sm">
            <div className="bg-muted/20 h-6 w-32 animate-pulse rounded" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-muted/5 flex items-center gap-3 rounded-lg p-3"
                >
                  <div className="bg-muted/20 h-10 w-10 animate-pulse rounded-full" />
                  <div className="bg-muted/10 h-5 flex-1 animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="border-primary/20 bg-muted/5 h-12 w-full animate-pulse rounded-lg border-2 border-dashed" />
          </div>
        </div>

        {/* Right Column - Settings Skeleton */}
        <div className="border-border bg-card/50 space-y-4 rounded-lg border p-6 backdrop-blur-sm">
          <div className="bg-muted/20 h-6 w-32 animate-pulse rounded" />
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="bg-muted/10 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted/10 h-10 w-full animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="bg-muted/10 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted/10 h-10 w-full animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="bg-muted/10 h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted/10 h-10 w-full animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-muted/10 h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted/10 h-6 w-12 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button Skeleton */}
      <div className="bg-background/80 border-border fixed bottom-0 left-0 w-full border-t p-4 backdrop-blur-lg">
        <div className="bg-muted/20 h-14 w-full animate-pulse rounded-lg" />
      </div>
    </motion.div>
  )
}
