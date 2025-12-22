/**
 * CategoryWarningPopup - Popups d'avertissement pour les catégories
 *
 * Extrait depuis lobby/[code]/page.tsx pour améliorer la maintenabilité.
 */

'use client'

interface CategoryWarningPopupProps {
  warningType: 'echange' | 'karaoke' | null
  onConfirm: (categoryId: string) => void
  onCancel: () => void
}

export default function CategoryWarningPopup({
  warningType,
  onConfirm,
  onCancel,
}: CategoryWarningPopupProps) {
  if (!warningType) return null

  const config = {
    echange: {
      emoji: '⚠️',
      title: 'Attention',
      description: 'Cette catégorie peut inclure des gages impliquant :',
      items: [
        'Offrir des verres ou boissons',
        'Petits achats ou cadeaux',
        "Consommation d'alcool",
      ],
      note: "Tu n'es jamais obligé de dépenser si tu ne veux pas.",
      noteColor: 'text-purple-300',
      categoryId: 'echange',
    },
    karaoke: {
      emoji: '🎤',
      title: 'Lieu adapté requis',
      description: 'Cette catégorie nécessite un environnement adapté :',
      items: ['Soirée karaoké', 'Bar dansant', 'Boîte de nuit'],
      note: 'Les gages incluent du chant et de la danse.',
      noteColor: 'text-cyan-300',
      categoryId: 'karaoke',
    },
  }

  const popup = config[warningType]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
        <div className="mb-4 text-center">
          <span className="text-4xl">{popup.emoji}</span>
          <h3 className="mt-2 text-xl font-bold text-white">{popup.title}</h3>
        </div>

        <p className="mb-4 text-sm text-white/80">{popup.description}</p>

        <ul className="mb-6 space-y-2 text-sm text-white/60">
          {popup.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>•</span> {item}
            </li>
          ))}
        </ul>

        <p
          className={`mb-6 text-center text-sm font-medium ${popup.noteColor}`}
        >
          {popup.note}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="glass-interactive flex-1 rounded-xl py-3 font-medium text-white"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(popup.categoryId)}
            className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-500"
          >
            J&apos;ai compris
          </button>
        </div>
      </div>
    </div>
  )
}
