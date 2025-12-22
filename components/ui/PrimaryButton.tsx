import { cn } from '@/lib/utils'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export default function PrimaryButton({
  children,
  onClick,
  className,
  icon,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'w-full px-6 py-4',
        'bg-gradient-to-r from-purple-600 to-pink-600',
        'hover:from-purple-500 hover:to-pink-500',
        'text-lg font-bold text-white',
        'rounded-2xl',
        'transition-all duration-300',
        'hover:scale-[1.02]',
        'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',
        'flex items-center justify-center gap-3',
        className
      )}
    >
      {icon}
      {children}
    </button>
  )
}
