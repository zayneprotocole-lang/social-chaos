'use client'

import { useLoadingStore } from '@/lib/store/useLoadingStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

/**
 * LoadingScreen - Fullscreen overlay that blocks interactions during loading
 * 
 * Features:
 * - Covers entire viewport with high z-index
 * - Animated card shuffle effect + spinner
 * - Optional message display
 * - Blocks all pointer events
 * - aria-busy for accessibility
 */
export function LoadingScreen() {
    const { isLoading, message } = useLoadingStore()

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                    aria-busy="true"
                    aria-label={message || "Chargement en cours"}
                    role="alert"
                >
                    {/* Animated Cards */}
                    <div className="relative w-32 h-40 mb-8">
                        {/* Card 1 - Left */}
                        <motion.div
                            animate={{
                                rotate: [-15, -10, -15],
                                x: [-20, -15, -20],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/80 to-purple-600/80 border-2 border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                        />

                        {/* Card 2 - Center */}
                        <motion.div
                            animate={{
                                rotate: [0, 5, 0],
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.2,
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/90 to-violet-700/90 border-2 border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                        />

                        {/* Card 3 - Right */}
                        <motion.div
                            animate={{
                                rotate: [15, 10, 15],
                                x: [20, 15, 20],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.4,
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-600/80 to-rose-700/80 border-2 border-pink-400/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                        />

                        {/* Center Icon */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Sparkles className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </motion.div>
                    </div>

                    {/* Loading Spinner */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mb-4"
                    >
                        <Loader2 className="w-8 h-8 text-primary" />
                    </motion.div>

                    {/* Message */}
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-medium text-white/90 text-center px-4"
                        >
                            {message}
                        </motion.p>
                    )}

                    {/* Loading dots animation */}
                    <div className="flex gap-1 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-2 h-2 rounded-full bg-primary"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
