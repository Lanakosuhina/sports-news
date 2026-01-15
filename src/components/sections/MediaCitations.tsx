'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

// Placeholder media partners - replace with actual logos/links in the future
const mediaPartners = [
  { name: 'Спорт КП', logo: null },
  { name: 'Чемпионат', logo: null },
  { name: 'Lenta.ru', logo: null },
  { name: 'Спортс', logo: null },
  { name: 'Golo FM', logo: null },
  { name: 'Mercado Web', logo: null },
  { name: 'Culture', logo: null },
  { name: 'Fogao Net', logo: null },
]

export default function MediaCitations() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Нас цитируют</h2>

        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-8">
                {mediaPartners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 text-slate-400 font-bold text-lg hover:text-slate-600 transition cursor-pointer"
                  >
                    {/* Replace with actual logo images in the future */}
                    {partner.name}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
