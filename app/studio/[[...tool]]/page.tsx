/**
 * Sanity Studio Route
 * Embeds Sanity Studio at /studio for local development
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
    return <NextStudio config={config} />
}
