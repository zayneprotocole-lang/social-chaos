import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Firestore Timestamp-like object with toMillis method */
interface TimestampWithMillis {
  toMillis: () => number
}

/** Raw Firestore timestamp object */
interface RawTimestamp {
  seconds: number
  nanoseconds?: number
}

/** Represents various date formats that can be converted to a timestamp */
type DateLike =
  | Date
  | string
  | number
  | TimestampWithMillis
  | RawTimestamp
  | null
  | undefined

/** Type guard for Firestore Timestamp with toMillis */
function hasToMillis(value: unknown): value is TimestampWithMillis {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toMillis' in value &&
    typeof (value as TimestampWithMillis).toMillis === 'function'
  )
}

/** Type guard for raw Firestore timestamp object */
function hasSeconds(value: unknown): value is RawTimestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as RawTimestamp).seconds === 'number'
  )
}

/**
 * Robustly get a timestamp (milliseconds) from various date formats
 * Handles: Date objects, Firestore Timestamps, ISO strings, numbers
 */
export function getTimestamp(date: DateLike): number {
  if (!date) return 0

  // If it's already a number (timestamp), return it
  if (typeof date === 'number') return date

  // If it's a standard Date object
  if (date instanceof Date) return date.getTime()

  // Handle Firestore Timestamp (duck typing to avoid importing firebase SDK here)
  if (hasToMillis(date)) {
    return date.toMillis()
  }

  // Handle raw Firestore object { seconds, nanoseconds }
  if (hasSeconds(date)) {
    return date.seconds * 1000 + (date.nanoseconds || 0) / 1000000
  }

  // Handle String (ISO format or other)
  if (typeof date === 'string') {
    const parsed = new Date(date).getTime()
    return isNaN(parsed) ? 0 : parsed
  }

  return 0
}
