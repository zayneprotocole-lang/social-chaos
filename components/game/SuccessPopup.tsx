'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkles, X } from 'lucide-react'

interface SuccessPopupProps {
    isOpen: boolean
    playerName?: string
    onAnimationComplete?: () => void
}

export default function SuccessPopup({
    isOpen,
    playerName,
    onAnimationComplete,
}: SuccessPopupProps) {
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
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, rotate: -10, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                                duration: 0.5
                            }}
                            onClick={onAnimationComplete} // Click anywhere to dismiss
                            className="relative w-full max-w-md pointer-events-auto cursor-pointer"
                        >
                            {/* Glowing Background Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-primary/30 to-yellow-500/30 blur-3xl rounded-3xl" />

                            {/* Main Card */}
                            <div className="relative bg-black/80 backdrop-blur-xl border-2 border-green-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
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
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
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
                                        <Sparkles className="w-6 h-6 text-green-400" />
                                    </motion.div>
                                </div>

                                {/* Close Button - Top right, above sparkles */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAnimationComplete?.()
                                    }}
                                    className="absolute -top-2 -right-2 p-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors z-20 shadow-lg"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                {/* Trophy Icon */}
                                <div className="flex justify-center mb-6">
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
                                        <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full" />
                                        <Trophy className="relative w-20 h-20 text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
                                    </motion.div>
                                </div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-black text-center bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent mb-4"
                                >
                                    FÉLICITATIONS !
                                </motion.h2>

                                {/* Player Name */}
                                {playerName && (
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xl font-bold text-center text-white/90 mb-2"
                                    >
                                        {playerName}
                                    </motion.p>
                                )}

                                {/* Message */}
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center text-white/70 text-sm"
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
                                            className="w-2 h-2 bg-green-400 rounded-full"
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
                                    className="text-center text-white/50 text-xs mt-2"
                                >
                                    Touchez pour continuer
                                </motion.p>
                            </div>

                            {/* Confetti Particles */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-3 h-3 rounded-full"
                                    style={{
                                        background: [
                                            '#10b981',
                                            '#fbbf24',
                                            '#a78bfa',
                                            '#f472b6',
                                            '#60a5fa',
                                        ][i % 5],
                                        left: '50%',
                                        top: '50%',
                                    }}
                                    animate={{
                                        x: [0, (Math.random() - 0.5) * 400],
                                        y: [0, (Math.random() - 0.5) * 400],
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
