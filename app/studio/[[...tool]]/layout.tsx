/**
 * Sanity Studio Layout
 * Uses viewport metadata to allow Studio to control zoom
 */

import type { Viewport } from 'next'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="sanity-studio-container" style={{ height: '100vh' }}>
            {children}
        </div>
    )
}
