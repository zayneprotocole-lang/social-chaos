'use client'

import { useQuery } from '@tanstack/react-query'
import { localHistory } from '@/lib/services/historyStorage'
import type { LocalHistoryItem } from '@/types/history'

/**
 * Fetch game history from localStorage (Offline-First).
 * Uses React Query for consistent data access patterns.
 */
export function useGameHistory() {
  return useQuery<LocalHistoryItem[]>({
    queryKey: ['gameHistory'],
    queryFn: async () => {
      // Get history from localStorage (already sorted by date desc)
      return localHistory.getAll()
    },
    staleTime: 0, // Always check localStorage for updates
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

/**
 * Get a single history item by ID.
 */
export function useHistoryItem(historyId: string | null) {
  return useQuery<LocalHistoryItem | null>({
    queryKey: ['historyItem', historyId],
    queryFn: async () => {
      if (!historyId) return null

      const allHistory = localHistory.getAll()
      return allHistory.find(item => item.id === historyId) || null
    },
    enabled: !!historyId,
    staleTime: 60 * 1000, // 1 minute
  })
}
