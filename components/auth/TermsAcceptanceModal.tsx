/**
 * TermsAcceptanceModal - Modal d'acceptation des CGU
 *
 * L'utilisateur doit cocher et signer électroniquement les conditions
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Check, FileText, Shield, AlertTriangle, Loader2 } from 'lucide-react'

interface TermsAcceptanceModalProps {
  isOpen: boolean
  userName: string
  onAccept: () => Promise<void>
}

export default function TermsAcceptanceModal({
  isOpen,
  userName,
  onAccept,
}: TermsAcceptanceModalProps) {
  const [acceptedCGU, setAcceptedCGU] = useState(false)
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)
  const [acceptedAge, setAcceptedAge] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allAccepted = acceptedCGU && acceptedDisclaimer && acceptedAge

  const handleSubmit = async () => {
    if (!allAccepted || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAccept()
    } catch (error) {
      console.error('Error accepting terms:', error)
      setIsSubmitting(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop - No click to close, user MUST accept */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 p-6"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Bienvenue, {userName} ! 👋
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Avant de commencer, accepte les conditions d&apos;utilisation
              </p>
            </div>

            {/* Terms Summary */}
            <div className="mb-6 space-y-3">
              {/* CGU */}
              <div className="rounded-xl bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" />
                  <div>
                    <h3 className="font-semibold text-white">
                      Conditions Générales d&apos;Utilisation
                    </h3>
                    <p className="mt-1 text-sm text-white/50">
                      Règles d&apos;utilisation de l&apos;application, respect
                      des autres joueurs, et utilisation responsable.
                    </p>
                    <Link
                      href="/legal"
                      target="_blank"
                      className="mt-2 inline-block text-sm text-purple-400 underline hover:text-purple-300"
                    >
                      Lire les CGU complètes →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400" />
                  <div>
                    <h3 className="font-semibold text-rose-300">
                      Clause de Non-Responsabilité
                    </h3>
                    <p className="mt-1 text-sm text-rose-200/70">
                      L&apos;éditeur se dégage de toute responsabilité en cas de
                      mauvaise utilisation. Tu es seul responsable de tes actes.
                    </p>
                    <Link
                      href="/legal"
                      target="_blank"
                      className="mt-2 inline-block text-sm text-rose-400 underline hover:text-rose-300"
                    >
                      Lire la clause complète →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mb-6 space-y-3">
              {/* CGU checkbox */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedCGU}
                    onChange={(e) => setAcceptedCGU(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      acceptedCGU
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {acceptedCGU && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-white/80">
                  J&apos;ai lu et j&apos;accepte les{' '}
                  <span className="font-semibold text-purple-400">
                    Conditions Générales d&apos;Utilisation
                  </span>{' '}
                  et la{' '}
                  <span className="font-semibold text-purple-400">
                    Politique de Confidentialité
                  </span>
                </span>
              </label>

              {/* Disclaimer checkbox */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedDisclaimer}
                    onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      acceptedDisclaimer
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {acceptedDisclaimer && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-white/80">
                  Je comprends que je suis{' '}
                  <span className="font-semibold text-rose-400">
                    seul responsable
                  </span>{' '}
                  de mon utilisation de l&apos;application et que l&apos;éditeur
                  ne pourra être tenu responsable de mes actes
                </span>
              </label>

              {/* Age checkbox */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedAge}
                    onChange={(e) => setAcceptedAge(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      acceptedAge
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {acceptedAge && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-white/80">
                  Je certifie être{' '}
                  <span className="font-semibold text-emerald-400">
                    majeur(e) (18 ans ou plus)
                  </span>{' '}
                  et capable juridiquement
                </span>
              </label>
            </div>

            {/* Signature info */}
            <div className="mb-6 rounded-xl bg-white/5 p-4 text-center">
              <p className="text-xs text-white/40">
                En cliquant sur le bouton ci-dessous, tu signes électroniquement
                ces conditions. Cette signature sera enregistrée avec la date et
                l&apos;heure.
              </p>
              <p className="mt-2 text-xs text-white/60">
                📅 Date de signature : {currentDate}
              </p>
            </div>

            {/* Submit button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!allAccepted || isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition-all ${
                allAccepted && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50'
                  : 'cursor-not-allowed bg-white/10 text-white/30'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  J&apos;accepte et je signe
                </>
              )}
            </motion.button>

            {/* Note */}
            <p className="mt-4 text-center text-xs text-white/30">
              Tu peux consulter ces conditions à tout moment dans les paramètres
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
