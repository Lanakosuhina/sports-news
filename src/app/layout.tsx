import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Тренды спорта - Последние спортивные новости и результаты матчей',
    template: '%s | Тренды спорта',
  },
  description: 'Ваш надёжный источник последних спортивных новостей, результатов матчей и аналитики из мира футбола, баскетбола, хоккея, тенниса, киберспорта и других видов спорта.',
  keywords: ['спортивные новости', 'футбол', 'баскетбол', 'хоккей', 'теннис', 'киберспорт', 'результаты матчей'],
  authors: [{ name: 'Тренды спорта' }],
  creator: 'Тренды спорта',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Тренды спорта',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  )
}
