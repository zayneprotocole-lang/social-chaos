/**
 * Sanity GROQ Queries
 * 
 * All queries to fetch content from Sanity
 */

import { groq } from 'next-sanity'

/**
 * Get all site texts (singleton document)
 */
export const siteTextsQuery = groq`*[_type == "siteTexts"][0]`

/**
 * Get specific section of texts
 */
export const getTextsSectionQuery = (section: string) =>
    groq`*[_type == "siteTexts"][0].${section}`
