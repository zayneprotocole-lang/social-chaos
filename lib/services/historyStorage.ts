import { LocalHistoryItem } from '@/types/history'

const HISTORY_STORAGE_KEY = 'social_chaos_history'
const MAX_HISTORY_ITEMS = 10

export const localHistory = {
    /**
     * Get all history items sorted by date (newest first)
     */
    getAll(): LocalHistoryItem[] {
        if (typeof window === 'undefined') return []

        try {
            const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
            if (!stored) return []

            const items: LocalHistoryItem[] = JSON.parse(stored)
            return items.sort((a, b) => b.playedAt - a.playedAt)
        } catch (error) {
            console.error('Failed to parse local history:', error)
            return []
        }
    },

    /**
     * Save a new game to history
     */
    save(item: Omit<LocalHistoryItem, 'id'>) {
        if (typeof window === 'undefined') return

        try {
            const currentHistory = this.getAll()

            const newItem: LocalHistoryItem = {
                ...item,
                id: crypto.randomUUID()
            }

            // Add new item to the beginning
            const updatedHistory = [newItem, ...currentHistory]
                // Sort by newest first
                .sort((a, b) => b.playedAt - a.playedAt)
                // Keep only the last MAX_HISTORY_ITEMS
                .slice(0, MAX_HISTORY_ITEMS)

            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
            console.log('✅ Game saved to local history')
        } catch (error) {
            console.error('Failed to save to local history:', error)
        }
    },

    /**
     * Clear all history
     */
    clear() {
        if (typeof window === 'undefined') return
        localStorage.removeItem(HISTORY_STORAGE_KEY)
    }
}
