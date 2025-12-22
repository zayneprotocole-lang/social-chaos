/**
 * SuccessConfetti - Popup de célébration avec confettis
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Sparkles } from 'lucide-react'

interface SuccessConfettiProps {
  isOpen: boolean
  onClose: () => void
  streak?: number
}

// Generate random confetti pieces
const generateConfetti = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#eab308'][
      Math.floor(Math.random() * 6)
    ],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
    shape: Math.random() > 0.5 ? '50%' : '2px',
  }))
}

export default function SuccessConfetti({
  isOpen,
  onClose,
  streak = 0,
}: SuccessConfettiProps) {
  const [confetti] = useState(() => generateConfetti(50))

  useEffect(() => {
    if (isOpen) {
      // Auto-close after animation
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: '-10vh',
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'linear',
              }}
              className="pointer-events-none absolute"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.shape,
              }}
            />
          ))}

          {/* Center content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Trophy icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
              }}
              className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.5)]"
            >
              <Trophy className="h-12 w-12 text-white" />
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-3xl font-black text-white"
            >
              BRAVO ! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-center text-lg text-white/70"
            >
              Mission accomplie !
            </motion.p>

            {/* Streak badge */}
            {streak > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2"
              >
                <Sparkles className="h-5 w-5 text-white" />
                <span className="font-bold text-white">
                  🔥 {streak} jours de suite !
                </span>
              </motion.div>
            )}

            {/* Stars decoration */}
            <div className="absolute -top-8 -left-8">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Star className="h-6 w-6 text-yellow-400" fill="currentColor" />
              </motion.div>
            </div>
            <div className="absolute -top-4 -right-12">
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Star className="h-8 w-8 text-yellow-400" fill="currentColor" />
              </motion.div>
            </div>
            <div className="absolute -right-6 -bottom-6">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
