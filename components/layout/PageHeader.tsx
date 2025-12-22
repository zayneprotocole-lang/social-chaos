'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  className?: string
}

export default function PageHeader({ title, className }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-14 w-full',
        'bg-background/80 border-primary/10 border-b backdrop-blur-lg',
        'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
        className
      )}
    >
      <div className="container mx-auto flex h-full items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-foreground text-xl font-bold">{title}</h1>
      </div>
    </header>
  )
}
