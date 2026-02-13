import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BookmakerForm from '@/components/admin/BookmakerForm'

interface EditBookmakerPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Редактировать букмекера - Admin',
}

export default async function EditBookmakerPage({ params }: EditBookmakerPageProps) {
  const { id } = await params

  const bookmaker = await prisma.bookmaker.findUnique({
    where: { id },
  })

  if (!bookmaker) {
    notFound()
  }

  // Transform the bookmaker data to match the form's expected types
  const bookmakerForForm = {
    ...bookmaker,
    customFields: bookmaker.customFields as Record<string, unknown> | null,
    textBlocks: bookmaker.textBlocks as unknown[] | null,
  }

  return <BookmakerForm bookmaker={bookmakerForForm} />
}
