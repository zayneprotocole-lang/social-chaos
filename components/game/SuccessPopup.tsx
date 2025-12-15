'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkles, X } from 'lucide-react'

interface SuccessPopupProps {
  isOpen: boolean
  playerName?: string
  onAnimationComplete?: () => void
}

// Pre-computed confetti positions to avoid Math.random during render
const CONFETTI_COLORS = ['#10b981', '#fbbf24', '#a78bfa', '#f472b6', '#60a5fa']

export default function SuccessPopup({
  isOpen,
  playerName,
  onAnimationComplete,
}: SuccessPopupProps) {
  // Pre-compute random confetti positions once using useState lazy initializer
  const [confettiPositions] = useState(() =>
    Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
    }))
  )

  useEffect(() => {
    if (isOpen && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200])
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onAnimationComplete}
          />

          {/* Popup */}
          <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: 0.5,
              }}
              onClick={onAnimationComplete} // Click anywhere to dismiss
              className="pointer-events-auto relative w-full max-w-md cursor-pointer"
            >
              {/* Glowing Background Effect */}
              <div className="via-primary/30 absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/30 to-yellow-500/30 blur-3xl" />

              {/* Main Card */}
              <div className="relative rounded-3xl border-2 border-green-500/50 bg-black/80 p-8 shadow-[0_0_50px_rgba(34,197,94,0.5)] backdrop-blur-xl">
                {/* Sparkle Icons */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                  </motion.div>
                </div>

                <div className="absolute top-4 left-4">
                  <motion.div
                    animate={{
                      rotate: [360, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 0.5,
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-green-400" />
                  </motion.div>
                </div>

                {/* Close Button - Top right, above sparkles */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAnimationComplete?.()
                  }}
                  className="absolute -top-2 -right-2 z-20 rounded-full bg-red-500/80 p-3 shadow-lg transition-colors hover:bg-red-500"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                {/* Trophy Icon */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-green-500/30 blur-2xl" />
                    <Trophy className="relative h-20 w-20 text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
                  </motion.div>
                </div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-center text-4xl font-black text-transparent"
                >
                  FÉLICITATIONS !
                </motion.h2>

                {/* Player Name */}
                {playerName && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-2 text-center text-xl font-bold text-white/90"
                  >
                    {playerName}
                  </motion.p>
                )}

                {/* Message */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-sm text-white/70"
                >
                  Défi relevé avec succès ! 🎉
                </motion.p>

                {/* Loading indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex justify-center gap-2"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-green-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-2 text-center text-xs text-white/50"
                >
                  Touchez pour continuer
                </motion.p>
              </div>

              {/* Confetti Particles */}
              {confettiPositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute h-3 w-3 rounded-full"
                  style={{
                    background: CONFETTI_COLORS[i % 5],
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, pos.x],
                    y: [0, pos.y],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
