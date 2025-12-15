/**
 * Draft Mode Disable API Route
 * Disables preview mode
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get('redirect') || '/'

    const draft = await draftMode()
    draft.disable()

    redirect(redirectTo)
}
