'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { Category } from '@prisma/client'

interface HeaderProps {
  categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
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
            <Link href="/page/advertising" className="text-slate-400 hover:text-white transition">Реклама</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Т</span>
            </div>
            <span className="text-xl font-bold">Тренды спорта</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition">
              Главная
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-4 py-2 hover:bg-slate-800 rounded-lg transition"
              >
                {category.name}
              </Link>
            ))}
            {categories.length > 6 && (
              <div className="relative group">
                <button className="px-4 py-2 hover:bg-slate-800 rounded-lg transition flex items-center gap-1">
                  Ещё <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 bg-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[200px]">
                  {categories.slice(6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
                className="w-full bg-slate-800 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          <nav className="lg:hidden pb-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-slate-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Главная
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block px-4 py-2 hover:bg-slate-800 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
