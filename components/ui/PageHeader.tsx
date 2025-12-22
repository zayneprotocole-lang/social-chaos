'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  showBack?: boolean
}

export default function PageHeader({
  title,
  showBack = true,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 rounded-none border-x-0 border-t-0 px-4 py-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      )}
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </header>
  )
}
