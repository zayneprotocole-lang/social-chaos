import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robustly get a timestamp (milliseconds) from various date formats
 * Handles: Date objects, Firestore Timestamps, ISO strings, numbers
 */
export function getTimestamp(date: any): number {
  if (!date) return 0

  // If it's already a number (timestamp), return it
  if (typeof date === 'number') return date

  // If it's a standard Date object
  if (date instanceof Date) return date.getTime()

  // Handle Firestore Timestamp (duck typing to avoid importing firebase SDK here)
  if (date && typeof date.toMillis === 'function') {
    return date.toMillis()
  }

  // Handle raw Firestore object { seconds, nanoseconds }
  if (date && typeof date.seconds === 'number') {
    return date.seconds * 1000 + (date.nanoseconds || 0) / 1000000
  }

  // Handle String (ISO format or other)
  if (typeof date === 'string') {
    const parsed = new Date(date).getTime()
    return isNaN(parsed) ? 0 : parsed
  }

  return 0
}
