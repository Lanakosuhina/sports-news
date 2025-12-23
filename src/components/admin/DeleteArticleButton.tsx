'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteArticleButtonProps {
  articleId: string
}

export default function DeleteArticleButton({
  articleId,
}: DeleteArticleButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Не удалось удалить статью')
      }
    } catch {
      alert('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-red-500 transition disabled:opacity-50"
      title="Удалить"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
