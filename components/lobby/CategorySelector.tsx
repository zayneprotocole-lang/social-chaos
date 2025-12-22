/**
 * CategorySelector - Composant de sélection des catégories
 *
 * Extrait depuis lobby/[code]/page.tsx pour améliorer la maintenabilité.
 */

'use client'

import {
  CATEGORY_GROUPS,
  ALL_CATEGORIES,
  CATEGORY_BG_COLORS,
  CATEGORY_SELECTED_COLORS,
  MIN_CATEGORIES_REQUIRED,
  type Category,
} from '@/lib/constants/categories'

interface CategorySelectorProps {
  selectedCategories: string[]
  onCategoryToggle: (category: Category) => void
}

export default function CategorySelector({
  selectedCategories,
  onCategoryToggle,
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      {CATEGORY_GROUPS.map((group, groupIndex) => (
        <div key={group.theme}>
          {/* Separator between groups */}
          {groupIndex > 0 && <div className="mb-4 h-px bg-white/10" />}

          {/* Theme label */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">{group.emoji}</span>
            <span className="text-xs font-medium tracking-wide text-white/60 uppercase">
              {group.theme}
            </span>
          </div>

          {/* Categories grid */}
          <div className="grid grid-cols-3 gap-2">
            {group.categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryToggle(cat)}
                  className={`flex min-h-[70px] flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? CATEGORY_SELECTED_COLORS[cat.id]
                      : `${CATEGORY_BG_COLORS[cat.id]} border-transparent opacity-50 hover:opacity-75`
                  } `}
                >
                  <span className="mb-0.5 text-xl">{cat.emoji}</span>
                  <span
                    className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={`mt-0.5 text-[8px] leading-tight ${isSelected ? 'text-white/70' : 'text-white/50'}`}
                  >
                    {cat.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Re-export types and constants for convenience
export { ALL_CATEGORIES, MIN_CATEGORIES_REQUIRED, type Category }
