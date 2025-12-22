/**
 * PWAUpdatePrompt - Notification de mise à jour disponible
 *
 * Affiche un toast quand une nouvelle version est disponible
 */

'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useServiceWorker } from '@/hooks/useServiceWorker'

export default function PWAUpdatePrompt() {
  const { isUpdateAvailable, updateApp } = useServiceWorker()

  useEffect(() => {
    if (isUpdateAvailable) {
      toast.info('Nouvelle version disponible', {
        description: 'Cliquez pour mettre à jour',
        duration: Infinity,
        action: {
          label: 'Mettre à jour',
          onClick: updateApp,
        },
      })
    }
  }, [isUpdateAvailable, updateApp])

  return null
}
