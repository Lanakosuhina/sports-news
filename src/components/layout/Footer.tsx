import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const mainCategories = [
  { name: 'Букмекеры', href: '/category/bukmekeryi' },
  { name: 'Бонусы', href: '/category/bonusyi' },
  { name: 'Центр ставок', href: '/category/tsentr-stavok' },
  { name: 'Новости', href: '/category/novosti' },
]

const quickLinks = [
  { name: 'О нас', href: '/page/about' },
  { name: 'Контакты', href: '/page/contacts' },
  { name: 'Пользовательское соглашение', href: '/page/user-agreement' },
  { name: 'Политика конфиденциальности', href: '/page/privacy-policy' },
  { name: 'Политика Cookie', href: '/page/cookie-policy' },
  { name: 'Ответственная игра', href: '/page/responsible-gaming' },
]

export default function Footer() {
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
              {mainCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
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
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-500 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
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

        {/* Legal information */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="text-slate-500 text-sm space-y-4">
            <p>
              Зарегистрировано Федеральной службой по надзору в сфере связи, информационных технологий
              и массовых коммуникаций (Роскомнадзор) 17.08.2018. Свидетельство о регистрации СМИ
              «Тренды спорта» ЭЛ № ФС 77 - 73473
            </p>
            <p>
              При использовании материалов сайта на других ресурсах активная ссылка на Тренды спорта обязательна.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
              <p>&copy; 2008 - {new Date().getFullYear()} Тренды спорта. Все права защищены.</p>
              <div className="flex items-center gap-2 text-orange-500 font-medium">
                <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-orange-500 rounded-full text-xs">
                  18+
                </span>
                <span>Для лиц старше 18 лет</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
