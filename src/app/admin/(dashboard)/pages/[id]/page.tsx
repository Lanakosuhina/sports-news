import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PageForm from '@/components/admin/PageForm'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params

  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  return <PageForm page={page} />
}
