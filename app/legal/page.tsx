'use client'

import PageHeader from '@/components/layout/PageHeader'
import { ScrollArea } from '@/components/ui/scroll-area'

const LEGAL_CONTENT = {
  cgu: {
    title: "Conditions Générales d'Utilisation",
    content:
      'Contenu des CGU à venir...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  safe: {
    title: 'Politique Safe - Jeu Responsable',
    content:
      "Notre politique de jeu responsable...\n\n• Jouez dans un cadre bienveillant\n• Respectez les limites de chacun\n• Ne forcez personne à réaliser un gage\n• L'alcool doit être consommé avec modération\n• Tout le monde a le droit de dire non",
  },
  privacy: {
    title: 'Politique de Confidentialité',
    content:
      'Politique de confidentialité à venir...\n\nVos données restent sur votre appareil. Nous ne collectons aucune information personnelle.',
  },
}

export default function LegalPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="CGU & Mentions légales" />

      <main className="container mx-auto max-w-3xl p-4">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="mb-8 space-y-4 pr-4">
            {Object.entries(LEGAL_CONTENT).map(([key, section]) => (
              <div
                key={key}
                className="bg-card/40 border-primary/20 rounded-lg border p-4 shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-md"
              >
                <h2 className="text-foreground mb-3 text-lg font-bold">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
