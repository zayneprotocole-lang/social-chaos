'use client'

import { Crown, Check, X } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '',
    features: [
      { text: 'Gages de base', included: true },
      { text: "Jusqu'à 4 joueurs", included: true },
      { text: 'Publicités', included: false },
      { text: 'Packs exclusifs', included: false },
    ],
    cta: 'Actuel',
    disabled: true,
    highlight: false,
  },
  {
    name: 'Premium',
    price: '4,99€',
    period: '/mois',
    features: [
      { text: 'Tout le contenu gratuit', included: true },
      { text: 'Joueurs illimités', included: true },
      { text: 'Aucune publicité', included: true },
      { text: 'Packs exclusifs', included: true },
      { text: 'Avant-premières', included: true },
    ],
    cta: 'Choisir',
    disabled: false,
    highlight: true,
  },
]

export default function PremiumPage() {
  return (
    <>
      <PageHeader title="Premium" />

      <main className="px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="glow-gold mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
            <Crown className="h-8 w-8 text-black" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">
            Social Chaos Premium
          </h2>
          <p className="text-white/60">Débloquez l'expérience ultime</p>
        </div>

        {/* Plans */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass flex flex-col rounded-2xl p-4 ${plan.highlight ? 'glow-gold border-amber-500/50' : ''} `}
            >
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/60">{plan.period}</span>
                </div>
              </div>

              <div className="mb-4 flex-1 space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0 text-red-400" />
                    )}
                    <span
                      className={
                        feature.included ? 'text-white/80' : 'text-white/40'
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.disabled}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:scale-105'
                    : 'cursor-not-allowed bg-white/10 text-white/60'
                } `}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Offre annuelle */}
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-sm text-white/60">
            ou <span className="font-bold text-white">29,99€/an</span>{' '}
            (économisez 50%)
          </p>
        </div>
      </main>
    </>
  )
}
