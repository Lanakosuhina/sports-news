import Link from 'next/link'
import BookmakersTable from './BookmakersTable'

interface Bookmaker {
  id: string
  name: string
  slug: string
  logo: string | null
  bonus: string | null
  bonusLabel: string | null
  reviewsCount: number
  link: string
}

interface AllBookmakersSectionProps {
  bookmakers: Bookmaker[]
}

export default function AllBookmakersSection({ bookmakers }: AllBookmakersSectionProps) {
  return (
    <section className="bg-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Все легальные букмекеры
          </h2>

          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-slate-600 leading-relaxed">
              Мы ответственно подходим ко всем рейтингам и информации, размещённой на нашем сайте,
              поэтому вы не найдёте здесь ничего о нелегальных букмекерах. Потому что «если о спорте —
              то честно», а уж о букмекерах — тем более!
            </p>
            <p className="text-slate-600 leading-relaxed">
              Мы рассматриваем ставки на спорт исключительно как развлечение и просим вас относиться
              к этому так же. Если ставки перестали быть развлечением, пора сделать перерыв и посетить
              раздел сайта{' '}
              <Link href="/page/responsible-gaming" className="text-blue-500 hover:text-blue-600 font-medium">
                «Ответственная игра»
              </Link>.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Кто такие легальные букмекеры?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Легальные букмекеры — это те, кто работает в России официально и законно, что гарантирует
              прозрачность всех финансовых операций, защиту прав игроков и отсутствие юридических проблем.
            </p>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Легальные букмекеры в России
          </h3>

          <BookmakersTable bookmakers={bookmakers} title="" />
        </div>
      </div>
    </section>
  )
}
