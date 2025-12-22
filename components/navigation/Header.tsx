'use client'

import { Crown, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 py-3">
      <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3">
        {/* Bouton Paramètres - Gauche */}
        <Link
          href="/settings"
          className="rounded-full p-3 transition-all hover:scale-105 hover:bg-white/15"
        >
          <Settings className="h-7 w-7 text-white" />
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bouton Premium - Droite */}
        <Link
          href="/premium"
          className="glow-gold flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 transition-all hover:scale-105 hover:from-amber-400 hover:to-yellow-400"
        >
          <Crown className="h-5 w-5 text-black" />
          <span className="text-sm font-bold tracking-wide text-black">
            PREMIUM
          </span>
        </Link>
      </div>
    </header>
  )
}
