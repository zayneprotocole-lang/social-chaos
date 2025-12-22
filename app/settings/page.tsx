'use client'

import { Globe, Eye, FileText, BookOpen, Bell } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import GlassCard from '@/components/ui/GlassCard'
import { useSettingsStore } from '@/lib/store/useSettingsStore'

export default function SettingsPage() {
  const { language, setLanguage, colorblindMode, setColorblindMode } =
    useSettingsStore()

  return (
    <>
      <PageHeader title="Paramètres" />

      <main className="space-y-4 px-4 pt-20 pb-8">
        {/* Langue */}
        <GlassCard interactive={false} className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <Globe className="h-6 w-6 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Langue</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('fr')}
              className={`rounded-xl px-4 py-3 font-medium transition-all ${
                language === 'fr'
                  ? 'border-2 border-purple-400 bg-purple-500/30 text-white'
                  : 'border-2 border-transparent bg-white/5 text-white/60 hover:bg-white/10'
              } `}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-xl px-4 py-3 font-medium transition-all ${
                language === 'en'
                  ? 'border-2 border-purple-400 bg-purple-500/30 text-white'
                  : 'border-2 border-transparent bg-white/5 text-white/60 hover:bg-white/10'
              } `}
            >
              🇬🇧 English
            </button>
          </div>
        </GlassCard>

        {/* Mode daltonien */}
        <GlassCard interactive={false} className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-purple-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Mode daltonien</h2>
                <p className="text-sm text-white/60">
                  Ajuste les couleurs pour une meilleure accessibilité
                </p>
              </div>
            </div>

            <button
              onClick={() => setColorblindMode(!colorblindMode)}
              className={`relative h-8 w-14 rounded-full transition-all ${colorblindMode ? 'bg-purple-500' : 'bg-white/20'} `}
            >
              <div
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${colorblindMode ? 'left-7' : 'left-1'} `}
              />
            </button>
          </div>
        </GlassCard>

        {/* Séparateur */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-xs tracking-wider text-white/30 uppercase">
            Informations
          </span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {/* Règles du jeu */}
        <Link href="/rules">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-cyan-400" />
                <div>
                  <h2 className="font-bold text-white">Règles du jeu</h2>
                  <p className="text-sm text-white/60">
                    Comment jouer à Social Chaos
                  </p>
                </div>
              </div>
              <span className="text-white/40">→</span>
            </div>
          </GlassCard>
        </Link>

        {/* Notes de mise à jour */}
        <Link href="/changelog">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-pink-400" />
                <div>
                  <h2 className="font-bold text-white">Notes de mise à jour</h2>
                  <p className="text-sm text-white/60">
                    Nouveautés et améliorations
                  </p>
                </div>
              </div>
              <span className="text-white/40">→</span>
            </div>
          </GlassCard>
        </Link>

        {/* CGU */}
        <Link href="/legal">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-400" />
                <div>
                  <h2 className="font-bold text-white">Conditions générales</h2>
                  <p className="text-sm text-white/60">
                    CGU, Politique de confidentialité
                  </p>
                </div>
              </div>
              <span className="text-white/40">→</span>
            </div>
          </GlassCard>
        </Link>
      </main>
    </>
  )
}
