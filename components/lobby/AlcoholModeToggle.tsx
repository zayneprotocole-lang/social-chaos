/**
 * AlcoholModeToggle - Toggle pour le mode alcool
 *
 * Extrait depuis lobby/[code]/page.tsx pour améliorer la maintenabilité.
 */

'use client'

interface AlcoholModeToggleProps {
  alcoolMode: boolean
  onToggle: () => void
}

export default function AlcoholModeToggle({
  alcoolMode,
  onToggle,
}: AlcoholModeToggleProps) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
        alcoolMode
          ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20'
          : 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-cyan-500/10'
      } `}
      style={{
        boxShadow: alcoolMode
          ? '0 0 25px rgba(245, 158, 11, 0.2)'
          : '0 0 15px rgba(6, 182, 212, 0.1)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon + Content */}
        <div className="flex items-start gap-3">
          {/* Dynamic icon */}
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
              alcoolMode
                ? 'bg-amber-500/30 text-amber-400'
                : 'bg-cyan-500/20 text-cyan-400'
            } `}
          >
            <span className="text-xl">{alcoolMode ? '🍺' : '☕'}</span>
          </div>

          {/* Explanatory text */}
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-base font-bold transition-colors ${alcoolMode ? 'text-amber-300' : 'text-cyan-300'} `}
            >
              {alcoolMode ? 'Mode Alcool' : 'Mode Sans Alcool'}
            </span>
            <span className="text-xs text-white/60">
              {alcoolMode
                ? 'Pénalités = gorgées à boire'
                : 'Pénalités = vérités à avouer'}
            </span>
          </div>
        </div>

        {/* Toggle visual */}
        <div
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-all duration-300 ${alcoolMode ? 'bg-amber-500' : 'bg-cyan-500/50'} `}
        >
          <div
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${alcoolMode ? 'left-6' : 'left-1'} `}
          />
        </div>
      </div>
    </div>
  )
}
