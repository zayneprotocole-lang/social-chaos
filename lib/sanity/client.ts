/**
 * Sanity Client
 * 
 * Used to fetch content from Sanity CMS
 */

import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Set to false for fresh data in preview mode
})

// Preview client (no CDN cache)
export const previewClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
})

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(previewMode = false) {
    return previewMode ? previewClient : client
}
