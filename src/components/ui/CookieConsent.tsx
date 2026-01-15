'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-700">
              Мы используем файлы cookie для улучшения работы сайта, показа персонализированной рекламы и анализа трафика. Нажимая «Принять все», вы соглашаетесь на использование cookie.{' '}
              <Link href="/page/cookie-policy" className="text-blue-500 hover:underline">
                Политика Cookie
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition"
            >
              Отклонить
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              Принять все
            </button>
            <button
              onClick={declineCookies}
              className="p-2 text-slate-400 hover:text-slate-600 transition md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
