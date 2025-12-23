import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Category } from '@prisma/client'

interface FooterProps {
  categories: Category[]
}

export default function Footer({ categories }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Т</span>
              </div>
              <span className="text-xl font-bold">Тренды спорта</span>
            </div>
            <p className="text-slate-400 mb-4">
              Ваш надёжный источник последних спортивных новостей, результатов матчей и аналитики со всего мира.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-slate-800 hover:bg-orange-500 rounded-lg transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-orange-500 rounded-lg transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-orange-500 rounded-lg transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-orange-500 rounded-lg transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Категории</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-slate-400 hover:text-orange-500 transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-orange-500 transition">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/page/about" className="text-slate-400 hover:text-orange-500 transition">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/page/advertising" className="text-slate-400 hover:text-orange-500 transition">
                  Реклама
                </Link>
              </li>
              <li>
                <Link href="/page/privacy-policy" className="text-slate-400 hover:text-orange-500 transition">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/page/cookie-policy" className="text-slate-400 hover:text-orange-500 transition">
                  Политика Cookie
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Рассылка</h3>
            <p className="text-slate-400 mb-4">
              Подпишитесь, чтобы получать последние спортивные новости на вашу почту.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Тренды спорта. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
