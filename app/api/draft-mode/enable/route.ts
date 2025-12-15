/**
 * Draft Mode API Route
 * Enables preview mode for Sanity Presentation
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get('redirect') || '/'

    const draft = await draftMode()
    draft.enable()

    redirect(redirectTo)
}
