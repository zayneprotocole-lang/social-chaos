'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, Sparkles, X, Star, Zap, Lock, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

const PREMIUM_BENEFITS = [
  {
    icon: Sparkles,
    title: 'Packs de gages exclusifs',
    description: 'Accès à tous les packs thématiques',
  },
  {
    icon: Zap,
    title: 'Aucune publicité',
    description: 'Expérience fluide sans interruption',
  },
  {
    icon: Star,
    title: 'Gages Premium',
    description: 'Des défis inédits et épicés',
  },
  {
    icon: Gift,
    title: 'Avant-premières',
    description: 'Accès anticipé aux nouvelles fonctionnalités',
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
      <DialogContent className="overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-amber-900/95 via-yellow-900/95 to-orange-900/95 shadow-[0_0_60px_rgba(234,179,8,0.3)]"
        >
          {/* Decorative top glow */}
          <div className="absolute top-0 left-1/2 h-1 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Crown className="mx-auto h-16 w-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
            </motion.div>
            <h2 className="mt-4 text-3xl font-black tracking-wide text-white uppercase">
              Premium
            </h2>
            <p className="mt-2 text-sm text-yellow-200/80">
              Débloquez l&apos;expérience ultime
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 px-6 pb-4">
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                  <benefit.icon className="h-5 w-5 text-yellow-400" />
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
            <p className="mt-1 text-sm text-white/40">
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
                  className="w-full rounded-xl bg-gray-800 py-4 text-center"
                >
                  <p className="flex items-center justify-center gap-2 font-bold text-white">
                    <Lock className="h-5 w-5" />
                    Bientôt disponible !
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    Nous travaillons dessus 🚀
                  </p>
                </motion.div>
              ) : (
                <motion.div key="button">
                  <Button
                    onClick={handlePurchase}
                    className={cn(
                      'w-full py-6 text-lg font-bold',
                      'bg-gradient-to-r from-yellow-500 to-amber-500',
                      'hover:from-yellow-400 hover:to-amber-400',
                      'text-black shadow-[0_0_30px_rgba(234,179,8,0.5)]',
                      'transition-all hover:scale-[1.02]'
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
        'relative overflow-hidden',
        'border-yellow-500/50 bg-gradient-to-r from-amber-950/50 to-yellow-950/50',
        'hover:from-amber-900/70 hover:to-yellow-900/70',
        'text-yellow-400 hover:text-yellow-300',
        'shadow-[0_0_20px_rgba(234,179,8,0.2)]',
        'hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]',
        'transition-all duration-300',
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
