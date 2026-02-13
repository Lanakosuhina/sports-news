import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  JsonLd,
  SITE_URL,
} from '@/lib/structured-data'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Тренды спорта - о спорте – честно!',
    template: '%s | Тренды спорта',
  },
  description: 'Мы – спортивное СМИ,  всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!',
  keywords: ['спортивные новости', 'футбол', 'баскетбол', 'хоккей', 'теннис', 'киберспорт', 'результаты матчей'],
  authors: [{ name: 'Тренды спорта' }],
  creator: 'Тренды спорта',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Тренды спорта',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang="ru">
      <head>
        <JsonLd data={[organizationSchema, webSiteSchema]} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  )
}
