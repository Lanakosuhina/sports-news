import Link from 'next/link'
import { Category } from '@prisma/client'
import {
  Trophy,
  Dumbbell,
  Bike,
  Target,
  Gamepad2,
  CircleDot,
  LucideIcon
} from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
}

const categoryIcons: Record<string, LucideIcon> = {
  football: CircleDot,
  soccer: CircleDot,
  basketball: Dumbbell,
  hockey: Trophy,
  tennis: Target,
  esports: Gamepad2,
  cycling: Bike,
  default: Trophy,
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const getCategoryIcon = (slug: string): LucideIcon => {
    return categoryIcons[slug.toLowerCase()] || categoryIcons.default
  }

  const categoryColors = [
    'from-blue-500 to-blue-600',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-cyan-500 to-cyan-600',
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => {
        const Icon = getCategoryIcon(category.slug)
        const colorClass = categoryColors[index % categoryColors.length]

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={`group relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br ${colorClass} hover:scale-105 transition-transform duration-300`}
          >
            <div className="relative z-10">
              <Icon className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="font-semibold text-lg">{category.name}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon className="w-24 h-24" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
