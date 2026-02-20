'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'

interface TimeAgoProps {
  date: Date | string
  className?: string
}

function calculateTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'только что'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн назад`
  return formatDate(date)
}

export default function TimeAgo({ date, className }: TimeAgoProps) {
  // Use formatted date for SSR to avoid hydration mismatch
  const [timeAgoText, setTimeAgoText] = useState(() => formatDate(date))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeAgoText(calculateTimeAgo(date))
  }, [date])

  // Update every minute for more accuracy
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setTimeAgoText(calculateTimeAgo(date))
    }, 60000)

    return () => clearInterval(interval)
  }, [date, mounted])

  return (
    <span className={className} suppressHydrationWarning>
      {timeAgoText}
    </span>
  )
}
