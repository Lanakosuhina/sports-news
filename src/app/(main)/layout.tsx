import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/ui/CookieConsent'

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CookieConsent />
    </div>
  )
}
