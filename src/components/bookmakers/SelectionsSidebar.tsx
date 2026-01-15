import Link from 'next/link'
import { ChevronRight, Gift, Smartphone, Diamond, Trophy, Percent, Zap, Globe } from 'lucide-react'

interface Selection {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface SelectionsSidebarProps {
  selections: Selection[]
  title?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  smartphone: Smartphone,
  diamond: Diamond,
  trophy: Trophy,
  percent: Percent,
  zap: Zap,
  globe: Globe,
}

export default function SelectionsSidebar({ selections, title = 'Подборки' }: SelectionsSidebarProps) {
  if (selections.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="space-y-1">
          {selections.map((selection) => {
            const IconComponent = selection.icon ? iconMap[selection.icon] : Gift
            return (
              <Link
                key={selection.id}
                href={`/category/${selection.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition group"
              >
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-white/80" />
                  )}
                  <span className="text-white font-medium">{selection.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
