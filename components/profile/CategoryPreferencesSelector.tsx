'use client'

import { CATEGORY_CONFIG } from '@/lib/constants/config'
import { DareCategory } from '@/types/index'
import { Heart, Ban } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryPreferencesSelectorProps {
  preferences: {
    want: string[]
    avoid: string[]
  }
  onChange: (preferences: { want: string[]; avoid: string[] }) => void
}

const NONE_VALUE = '__none__'

export function CategoryPreferencesSelector({
  preferences,
  onChange,
}: CategoryPreferencesSelectorProps) {
  const categories = Object.keys(CATEGORY_CONFIG) as DareCategory[]

  // Current selections (first item or none)
  const currentWant = preferences.want[0] || NONE_VALUE
  const currentAvoid = preferences.avoid[0] || NONE_VALUE

  const handleWantChange = (value: string) => {
    const newWant = value === NONE_VALUE ? [] : [value]
    // If selecting the same as avoid, clear avoid
    const newAvoid =
      value !== NONE_VALUE && preferences.avoid.includes(value)
        ? []
        : preferences.avoid
    onChange({ want: newWant, avoid: newAvoid })
  }

  const handleAvoidChange = (value: string) => {
    const newAvoid = value === NONE_VALUE ? [] : [value]
    // If selecting the same as want, clear want
    const newWant =
      value !== NONE_VALUE && preferences.want.includes(value)
        ? []
        : preferences.want
    onChange({ want: newWant, avoid: newAvoid })
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Préférences de gages</Label>

      {/* J'adore */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-green-500">
          <Heart className="size-4" />
          <span className="font-medium">J&apos;adore</span>
        </div>
        <Select value={currentWant} onValueChange={handleWantChange}>
          <SelectTrigger className="bg-background/50 w-full border-green-500/30 focus:ring-green-500/30">
            <SelectValue placeholder="Aucune préférence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              <span className="text-muted-foreground">Aucune préférence</span>
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {CATEGORY_CONFIG[category].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Je ne veux pas */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-red-500">
          <Ban className="size-4" />
          <span className="font-medium">Je ne veux pas</span>
        </div>
        <Select value={currentAvoid} onValueChange={handleAvoidChange}>
          <SelectTrigger className="bg-background/50 w-full border-red-500/30 focus:ring-red-500/30">
            <SelectValue placeholder="Aucune exclusion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              <span className="text-muted-foreground">Aucune exclusion</span>
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {CATEGORY_CONFIG[category].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
