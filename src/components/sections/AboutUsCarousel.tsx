'use client'

import { useState, useRef, useEffect } from 'react'
import { Award, TrendingUp, Gift, Newspaper, Shield, Users, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

const aboutItems = [
  {
    icon: Award,
    title: 'Независимые рейтинги букмекеров',
    description: 'Объективные оценки по ключевым критериям: надёжность, коэффициенты, бонусы и скорость выплат',
  },
  {
    icon: TrendingUp,
    title: 'Бесплатные прогнозы на спорт',
    description: 'Аналитика только от профессионалов и экспертов нашего сообщества с высокой проходимостью',
  },
  {
    icon: Gift,
    title: 'Эксклюзивные бонусы',
    description: 'Свежие и уникальные предложения от партнёров портала, недоступные на других ресурсах',
  },
  {
    icon: Newspaper,
    title: 'Спортивные новости',
    description: 'Эксклюзивные материалы от редакции портала: интервью, обзоры и горячие новости',
  },
  {
    icon: Shield,
    title: 'Защита игроков',
    description: 'Помогаем решать споры с букмекерами и защищаем права пользователей',
  },
  {
    icon: Users,
    title: 'Активное сообщество',
    description: 'Более 200 000 пользователей обсуждают ставки, делятся опытом и советами',
  },
  {
    icon: Star,
    title: 'Честные отзывы',
    description: 'Реальные отзывы игроков о букмекерских конторах без цензуры',
  },
  {
    icon: Clock,
    title: 'Оперативная поддержка',
    description: 'Быстрые ответы на вопросы и помощь в выборе надёжного букмекера',
  },
]

export default function AboutUsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(4)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = aboutItems.length - 1

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Get visible items - always show itemsPerView items, scrolling by 1
  const getVisibleItems = () => {
    const items = []
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % aboutItems.length
      items.push(aboutItems[index])
    }
    return items
  }

  const visibleItems = getVisibleItems()

  return (
    <section className="bg-slate-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Главное о нас</h2>

        <div className="relative">
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {visibleItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={`${currentIndex}-${index}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <IconComponent className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-slate-900 font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition z-10"
            aria-label="Назад"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition z-10"
            aria-label="Вперёд"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>

          {/* Dots indicator - one per starting position */}
          <div className="flex justify-center gap-2 mt-6">
            {aboutItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  currentIndex === index
                    ? 'bg-blue-500'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
