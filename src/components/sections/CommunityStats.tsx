import { Users, MessageSquare, Star, AlertCircle } from 'lucide-react'

// Stats data - can be fetched from database in the future
const stats = [
  {
    value: '208 858',
    label: 'пользователей',
    icon: Users,
  },
  {
    value: '25 514',
    label: 'комментариев',
    icon: MessageSquare,
  },
  {
    value: '16 832',
    label: 'отзыва',
    icon: Star,
  },
  {
    value: '21 223',
    label: 'жалобы на БК',
    icon: AlertCircle,
  },
]

export default function CommunityStats() {
  return (
    <section className="bg-slate-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Наше сообщество</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
                <IconComponent className="w-8 h-8 text-blue-500 flex-shrink-0" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
