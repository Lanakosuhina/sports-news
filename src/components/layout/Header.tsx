'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, ChevronDown } from 'lucide-react'

interface NavItem {
  name: string
  href?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Букмекеры',
    children: [
      { name: 'Букмекеры с бонусами', href: '/category/bukmekeryi-s-bonusami' },
      { name: 'Приложения букмекеров', href: '/category/prilozheniya-bukmekerov' },
      { name: 'Все легальные букмекеры', href: '/category/vse-legalnyie-bukmekeryi' },
      { name: 'Честный рейтинг', href: '/category/chestnyiy-reyting' },
    ]
  },
  {
    name: 'Бонусы',
    children: [
      { name: 'Без депозита', href: '/category/bez-depozita' },
      { name: 'Фрибет', href: '/category/fribet' },
      {
        name: 'По букмекеру',
        children: [
          { name: 'Промокод Winline', href: '/category/promokod-winline' },
          { name: 'Промокоды Fonbet', href: '/category/promokodyi-fonbet' },
        ]
      },
    ]
  },
  {
    name: 'Центр ставок',
    children: [
      { name: 'Матчи сегодня', href: '/matches/today' },
      { name: 'Матчи завтра', href: '/matches/tomorrow' },
      { name: 'Все матчи', href: '/matches' },
      {
        name: 'Футбол',
        href: '/matches/futbol',
        children: [
          { name: 'Все матчи футбола', href: '/matches/futbol' },
          { name: 'Лига чемпионов', href: '/matches/futbol/liga-chempionov' },
          { name: 'Лига Европы', href: '/matches/futbol/liga-evropyi' },
          { name: 'РПЛ', href: '/matches/futbol/rpl' },
          { name: 'Кубок России', href: '/matches/futbol/kubok-rossii' },
          { name: 'АПЛ', href: '/matches/futbol/apl' },
          { name: 'Ла Лига', href: '/matches/futbol/la-liga' },
          { name: 'Серия А', href: '/matches/futbol/seriya-a' },
          { name: 'Бундеслига', href: '/matches/futbol/bundesliga' },
          { name: 'Лига 1', href: '/matches/futbol/liga-1' },
        ]
      },
      {
        name: 'Хоккей',
        href: '/matches/hokkey',
        children: [
          { name: 'Все матчи хоккея', href: '/matches/hokkey' },
          { name: 'КХЛ', href: '/matches/hokkey/khl' },
          { name: 'НХЛ', href: '/matches/hokkey/nhl' },
        ]
      },
      {
        name: 'Теннис',
        href: '/matches/tennis',
        children: [
          { name: 'Все матчи тенниса', href: '/matches/tennis' },
          { name: 'Australian Open', href: '/matches/tennis/australian-open' },
          { name: 'Roland Garros', href: '/matches/tennis/roland-garros' },
          { name: 'Уимблдон', href: '/matches/tennis/uimbldon' },
          { name: 'US Open', href: '/matches/tennis/us-open' },
        ]
      },
    ]
  },
  {
    name: 'Новости',
    href: '/news',
    children: [
      { name: 'Все новости', href: '/news' },
      { name: 'Футбол', href: '/news/futbol' },
      { name: 'Хоккей', href: '/news/hokkey' },
      { name: 'Теннис', href: '/news/tennis' },
      { name: 'Баскетбол', href: '/news/basketbol' },
      { name: 'ММА', href: '/news/mma' },
      { name: 'Бокс', href: '/news/boks' },
    ]
  },
]

function NavDropdown({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  const [open, setOpen] = useState(false)

  if (!item.children) {
    return (
      <Link
        href={item.href || '#'}
        className={mobile
          ? "block px-4 py-2 hover:bg-slate-800 rounded-lg transition"
          : "px-4 py-2 hover:bg-slate-800 rounded-lg transition whitespace-nowrap"
        }
      >
        {item.name}
      </Link>
    )
  }

  if (mobile) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800 rounded-lg transition"
        >
          {item.name}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <NavDropdown key={child.name} item={child} mobile />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="px-4 py-2 hover:bg-slate-800 rounded-lg transition flex items-center gap-1 whitespace-nowrap">
        {item.name} <ChevronDown className="w-4 h-4" />
      </button>
      <div className="absolute top-full left-0 bg-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[220px] py-2 z-50">
        {item.children.map((child) => (
          child.children ? (
            <div key={child.name} className="relative group/sub">
              <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700 text-left">
                {child.name}
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
              <div className="absolute left-full top-0 bg-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all min-w-[200px] py-2">
                {child.children.map((subChild) => (
                  <Link
                    key={subChild.name}
                    href={subChild.href || '#'}
                    className="block px-4 py-2 hover:bg-slate-700 whitespace-nowrap"
                  >
                    {subChild.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={child.name}
              href={child.href || '#'}
              className="block px-4 py-2 hover:bg-slate-700 whitespace-nowrap"
            >
              {child.name}
            </Link>
          )
        ))}
      </div>
    </div>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/page/about" className="text-slate-400 hover:text-white transition">О нас</Link>
            <Link href="/page/contacts" className="text-slate-400 hover:text-white transition">Контакты</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Тренды спорта" className="w-10 h-10" />
            <span className="text-xl font-bold">Тренды спорта</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition">
              Главная
            </Link>
            {navigation.map((item) => (
              <NavDropdown key={item.name} item={item} />
            ))}
          </nav>

          {/* Search and mobile menu */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Поиск новостей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1 max-h-[70vh] overflow-y-auto">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-slate-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Главная
            </Link>
            {navigation.map((item) => (
              <NavDropdown key={item.name} item={item} mobile />
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
