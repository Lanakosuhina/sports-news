'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Download, X } from 'lucide-react'

interface Notification {
  id: string
  message: string
  count: number
  createdAt: string
}

export default function ImportNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/import/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setPendingCount(data.pendingCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/import/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      setNotifications([])
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const hasUnread = notifications.length > 0 || pendingCount > 0

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-20 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-slate-50">
              <h3 className="font-semibold text-slate-900">Import Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-orange-500 hover:text-orange-600"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {pendingCount > 0 && (
                <Link
                  href="/admin/import"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {pendingCount} articles pending
                    </p>
                    <p className="text-sm text-slate-500">
                      Ready to import
                    </p>
                  </div>
                </Link>
              )}

              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{notification.message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {!hasUnread && (
                <div className="p-6 text-center text-slate-500">
                  No new notifications
                </div>
              )}
            </div>

            <div className="p-2 border-t bg-slate-50">
              <Link
                href="/admin/import"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-orange-500 hover:text-orange-600 py-2"
              >
                View Import Dashboard
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
