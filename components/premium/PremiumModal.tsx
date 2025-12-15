'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, Check, Sparkles, X, Star, Zap, Lock, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumModalProps {
    isOpen: boolean
    onClose: () => void
}

const PREMIUM_BENEFITS = [
    {
        icon: Sparkles,
        title: "Packs de gages exclusifs",
        description: "Accès à tous les packs thématiques"
    },
    {
        icon: Zap,
        title: "Aucune publicité",
        description: "Expérience fluide sans interruption"
    },
    {
        icon: Star,
        title: "Gages Premium",
        description: "Des défis inédits et épicés"
    },
    {
        icon: Gift,
        title: "Avant-premières",
        description: "Accès anticipé aux nouvelles fonctionnalités"
    },
]

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
    const [showComingSoon, setShowComingSoon] = useState(false)

    const handlePurchase = () => {
        setShowComingSoon(true)
        setTimeout(() => setShowComingSoon(false), 3000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg p-0 bg-transparent border-0 shadow-none overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-gradient-to-br from-amber-900/95 via-yellow-900/95 to-orange-900/95 border-2 border-yellow-500/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(234,179,8,0.3)]"
                >
                    {/* Decorative top glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center pt-8 pb-4 px-6">
                        <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Crown className="mx-auto h-16 w-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
                        </motion.div>
                        <h2 className="mt-4 text-3xl font-black text-white uppercase tracking-wide">
                            Premium
                        </h2>
                        <p className="mt-2 text-yellow-200/80 text-sm">
                            Débloquez l&apos;expérience ultime
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="px-6 pb-4 space-y-3">
                        {PREMIUM_BENEFITS.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                    <benefit.icon className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{benefit.title}</h3>
                                    <p className="text-sm text-white/60">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="px-6 pb-4 text-center">
                        <div className="inline-flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">4,99€</span>
                            <span className="text-white/60">/mois</span>
                        </div>
                        <p className="text-sm text-white/40 mt-1">
                            ou 29,99€/an (économisez 50%)
                        </p>
                    </div>

                    {/* Purchase Button */}
                    <div className="px-6 pb-8">
                        <AnimatePresence mode="wait">
                            {showComingSoon ? (
                                <motion.div
                                    key="coming-soon"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full py-4 rounded-xl bg-gray-800 text-center"
                                >
                                    <p className="text-white font-bold flex items-center justify-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Bientôt disponible !
                                    </p>
                                    <p className="text-white/50 text-sm mt-1">
                                        Nous travaillons dessus 🚀
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div key="button">
                                    <Button
                                        onClick={handlePurchase}
                                        className={cn(
                                            "w-full py-6 text-lg font-bold",
                                            "bg-gradient-to-r from-yellow-500 to-amber-500",
                                            "hover:from-yellow-400 hover:to-amber-400",
                                            "text-black shadow-[0_0_30px_rgba(234,179,8,0.5)]",
                                            "transition-all hover:scale-[1.02]"
                                        )}
                                    >
                                        <Crown className="mr-2 h-5 w-5" />
                                        Devenir Premium
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

interface PremiumButtonProps {
    onClick: () => void
    className?: string
}

/**
 * Premium button for the home page
 * Styled with gold/amber theme and subtle animation
 */
export function PremiumButton({ onClick, className }: PremiumButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="outline"
            className={cn(
                "relative overflow-hidden",
                "border-yellow-500/50 bg-gradient-to-r from-amber-950/50 to-yellow-950/50",
                "hover:from-amber-900/70 hover:to-yellow-900/70",
                "text-yellow-400 hover:text-yellow-300",
                "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
                "hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]",
                "transition-all duration-300",
                className
            )}
        >
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Crown className="mr-2 h-4 w-4" />
            <span className="relative">Premium</span>
        </Button>
    )
}
