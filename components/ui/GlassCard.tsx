import { cn } from '@/lib/utils'
import Link from 'next/link'

interface GlassCardProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export default function GlassCard({
  href,
  onClick,
  children,
  className,
  interactive = true,
}: GlassCardProps) {
  const baseClasses = cn(
    'rounded-2xl p-6',
    interactive ? 'glass-interactive' : 'glass',
    className
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {children}
      </button>
    )
  }

  return <div className={baseClasses}>{children}</div>
}
