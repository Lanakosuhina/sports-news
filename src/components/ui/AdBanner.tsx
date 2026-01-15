'use client'

interface AdBannerProps {
  className?: string
}

export default function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-xl p-4 md:p-6 relative overflow-hidden">
        {/* Ad label */}
        <div className="absolute top-2 left-2 text-xs text-white/80">
          РЕКЛАМА
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Logo and text */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-white font-bold text-2xl md:text-3xl">
              LEON
            </div>
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-xl md:text-2xl">
                СТРАХОВКА ПАРИ
              </div>
              <div className="text-white/80 text-sm">
                Только в мобильном приложении
              </div>
            </div>
          </div>

          {/* Right side - Bonus */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-white/80 text-xs uppercase">Новым клиентам</div>
              <div className="text-white font-bold text-3xl md:text-4xl">
                до 25
              </div>
              <div className="text-white text-sm">тысяч рублей</div>
              <div className="text-yellow-300 text-xs font-semibold">ФРИБЕТАМИ</div>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold">
              18+
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-4 flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-2 rounded-lg transition">
            ПОЛУЧИТЬ
          </button>
          <div className="text-white/60 text-xs">
            Реклама 18+ ООО «Леон», ОГРН 1117746832367
          </div>
        </div>

        {/* Decorative balls */}
        <div className="absolute -right-4 -top-4 w-20 h-20 md:w-32 md:h-32 opacity-20">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>
        <div className="absolute -right-8 top-1/2 w-16 h-16 md:w-24 md:h-24 opacity-10">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  )
}
