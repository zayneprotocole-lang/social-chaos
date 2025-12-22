'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HelpBubbleProps {
  text: string
}

/**
 * Clickable help bubble that opens a popup with help text
 * If text is empty, still shows the popup but without content
 */
export default function HelpBubble({ text }: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Help Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full p-1.5 text-white/40 transition-all duration-200 hover:bg-white/10 hover:text-white/80 active:scale-95"
        aria-label="Aide"
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {/* Popup Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="glass-strong fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 rounded-full p-1.5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="pr-8">
                <div className="mb-3 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white">Aide</h3>
                </div>

                {text ? (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-white/80">
                    {text}
                  </p>
                ) : (
                  <p className="text-sm text-white/40 italic">
                    Aucune aide disponible pour cette section.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
