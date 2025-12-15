/**
 * Sanity Utilities
 * 
 * Helper functions for fetching and using Sanity content
 */

import { client } from './client'
import { siteTextsQuery } from './queries'
import { TEXTS } from '@/lib/constants/texts'

export type SanityTexts = typeof TEXTS

/**
 * Fetch all site texts from Sanity
 * Falls back to local TEXTS constant if Sanity fetch fails
 */
export async function getSiteTexts(): Promise<SanityTexts> {
    try {
        const sanityTexts = await client.fetch(siteTextsQuery)

        if (!sanityTexts) {
            console.log('📝 No Sanity texts found, using local fallback')
            return TEXTS
        }

        // Deep merge Sanity texts with local fallback
        return mergeTexts(TEXTS, sanityTexts)
    } catch (error) {
        console.error('Failed to fetch Sanity texts, using local fallback:', error)
        return TEXTS
    }
}

/**
 * Deep merge two objects, preferring values from the second object
 */
function mergeTexts<T extends Record<string, unknown>>(
    fallback: T,
    override: Partial<T>
): T {
    const result = { ...fallback }

    for (const key in override) {
        const overrideValue = override[key]
        const fallbackValue = fallback[key]

        if (
            overrideValue !== null &&
            overrideValue !== undefined &&
            typeof overrideValue === 'object' &&
            !Array.isArray(overrideValue) &&
            typeof fallbackValue === 'object' &&
            !Array.isArray(fallbackValue)
        ) {
            result[key] = mergeTexts(
                fallbackValue as Record<string, unknown>,
                overrideValue as Record<string, unknown>
            ) as T[Extract<keyof T, string>]
        } else if (overrideValue !== null && overrideValue !== undefined) {
            result[key] = overrideValue as T[Extract<keyof T, string>]
        }
    }

    return result
}
