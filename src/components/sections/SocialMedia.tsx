import Link from 'next/link'
import { Youtube, Send } from 'lucide-react'

// Social media links - update with actual links in the future
const socialLinks = [
  {
    name: 'YouTube Канал',
    platform: 'youtube',
    subscribers: '46 790',
    url: '#',
    icon: Youtube,
    color: 'bg-red-500',
  },
  {
    name: 'Telegram Спорт',
    platform: 'telegram',
    subscribers: '27 873',
    url: '#',
    icon: Send,
    color: 'bg-blue-500',
  },
  {
    name: 'Telegram Дейли',
    platform: 'telegram',
    subscribers: '15 599',
    url: '#',
    icon: Send,
    color: 'bg-blue-500',
  },
]

export default function SocialMedia() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Мы в социальных сетях</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon
            return (
              <Link
                key={index}
                href={social.url}
                className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition"
              >
                <div className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{social.name}</div>
                  <div className="text-slate-500 text-sm">{social.subscribers}</div>
                </div>
              </Link>
            )
          })}

          {/* Show all button */}
          <Link
            href="#"
            className="flex items-center justify-center bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition text-blue-500 font-semibold"
          >
            Показать все
          </Link>
        </div>
      </div>
    </section>
  )
}
