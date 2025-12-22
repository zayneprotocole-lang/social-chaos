'use client'

import { CalendarDays, Sparkles } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import GlassCard from '@/components/ui/GlassCard'

const versions = [
  {
    version: 'v1.0.0',
    date: 'Décembre 2025',
    type: 'Lancement',
    changes: [
      'Lancement officiel de Social Chaos',
      'Système de gages avec différents niveaux de difficulté',
      'Actions spéciales : Joker, Re-roll, Swap',
      'Système Mentor & Élève',
      'Historique des parties',
      'Bibliothèque de favoris',
    ],
  },
  {
    version: 'v0.9.0',
    date: 'Novembre 2025',
    type: 'Beta',
    changes: [
      'Mode hors-ligne complet',
      'Optimisation des performances',
      'Nouveau design Dark Neon',
      "Refonte complète de l'interface",
      'Amélioration du système de score',
    ],
  },
  {
    version: 'v0.5.0',
    date: 'Octobre 2025',
    type: 'Alpha',
    changes: [
      'Première version alpha',
      'Système de base fonctionnel',
      'Gestion des profils locaux',
      'Timer de gage',
      'Système de points',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <PageHeader title="Mises à jour" />

      <main className="space-y-4 px-4 pt-20 pb-8">
        {versions.map((v, idx) => (
          <GlassCard key={idx} interactive={false} className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{v.version}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.type === 'Lancement' ? 'bg-green-500/20 text-green-300' : ''} ${v.type === 'Beta' ? 'bg-blue-500/20 text-blue-300' : ''} ${v.type === 'Alpha' ? 'bg-orange-500/20 text-orange-300' : ''} `}
                  >
                    {v.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <CalendarDays className="h-4 w-4" />
                  <span>{v.date}</span>
                </div>
              </div>
              {idx === 0 && <Sparkles className="h-6 w-6 text-amber-400" />}
            </div>

            <ul className="space-y-2">
              {v.changes.map((change, changeIdx) => (
                <li
                  key={changeIdx}
                  className="flex items-start gap-2 text-sm text-white/70"
                >
                  <span className="mt-1 text-purple-400">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </main>
    </>
  )
}
