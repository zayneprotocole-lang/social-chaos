/**
 * PWAInstallPrompt - Bouton d'installation PWA
 *
 * Affiche un bouton discret pour installer l'app
 * Disparaît automatiquement si l'app est déjà installée
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { useServiceWorker } from '@/hooks/useServiceWorker'

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installApp } = useServiceWorker()
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null
  }

  const handleInstall = async () => {
    const success = await installApp()
    if (!success) {
      // User declined, dismiss the prompt
      setIsDismissed(true)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed right-4 bottom-4 left-4 z-50 md:right-4 md:left-auto md:w-80"
      >
        <div className="glass-strong rounded-2xl border border-purple-500/30 p-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          {/* Close button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Smartphone className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-white">Installer Social Chaos</h3>
              <p className="mt-0.5 text-xs text-white/60">
                Accès rapide, mode hors-ligne et notifications
              </p>

              {/* Install button */}
              <button
                onClick={handleInstall}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                Installer l&apos;app
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
