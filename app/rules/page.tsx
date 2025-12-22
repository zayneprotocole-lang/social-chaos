'use client'

import { Gamepad2, Timer, Zap, Users, Trophy } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import GlassCard from '@/components/ui/GlassCard'

const sections = [
  {
    icon: Gamepad2,
    title: 'Concept',
    content:
      'Social Chaos est un jeu de gages en groupe. Chaque joueur doit réaliser des défis pour gagner des points. Le joueur avec le plus de points devient le GOAT, celui avec le moins devient la Chèvre.',
  },
  {
    icon: Timer,
    title: 'Déroulement',
    content:
      "À tour de rôle, chaque joueur tire une carte de gage. Il a un temps limité (selon la difficulté) pour réaliser le défi. S'il réussit, il gagne des points. S'il abandonne, il reçoit une sentence.",
  },
  {
    icon: Zap,
    title: 'Actions',
    items: [
      { name: 'Joker', desc: 'Passe le gage sans pénalité (1 par partie)' },
      { name: 'Re-roll', desc: 'Tire une nouvelle carte (2 par partie)' },
      { name: 'Swap', desc: 'Échange avec un autre joueur (2 par partie)' },
      {
        name: 'Accompagnement',
        desc: 'Réalise le défi en duo avec ton partenaire',
      },
    ],
  },
  {
    icon: Users,
    title: 'Mentor & Élève',
    content:
      "À la fin d'une partie, le GOAT devient Mentor et la Chèvre devient Élève. Lors de leur prochaine partie ensemble, ils peuvent utiliser l'action Accompagnement.",
  },
  {
    icon: Trophy,
    title: 'GOAT & Chèvre',
    content:
      "Le GOAT (Greatest Of All Time) est le vainqueur avec le plus de points. La Chèvre est le perdant. L'Aventurier est un joueur qui a été mis en pause pendant la partie.",
  },
]

export default function RulesPage() {
  return (
    <>
      <PageHeader title="Règles du jeu" />

      <main className="space-y-4 px-4 pt-20 pb-8">
        {sections.map((section, idx) => (
          <GlassCard key={idx} interactive={false} className="p-5">
            <div className="mb-3 flex items-center gap-3">
              <section.icon className="h-6 w-6 text-purple-400" />
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
            </div>

            {section.content && (
              <p className="text-sm leading-relaxed text-white/70">
                {section.content}
              </p>
            )}

            {section.items && (
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <div>
                      <span className="font-medium text-white">
                        {item.name}
                      </span>
                      <span className="text-white/60"> - {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        ))}
      </main>
    </>
  )
}
