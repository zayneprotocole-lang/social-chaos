'use client'

import HelpBubble from '@/components/ui/HelpBubble'

interface LobbySectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
  helpText?: string // Optional help text for the bubble popup
}

export default function LobbySection({
  icon,
  title,
  children,
  className = '',
  helpText,
}: LobbySectionProps) {
  return (
    <div className={`glass rounded-2xl p-3 ${className}`}>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {/* Help bubble - always visible, shows empty message if no text */}
        {helpText !== undefined && <HelpBubble text={helpText} />}
      </div>
      {children}
    </div>
  )
}
