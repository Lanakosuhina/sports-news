'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface AdData {
  id: string
  imageUrl: string | null
  linkUrl: string | null
  code: string | null
}

export default function FullscreenBanner() {
  const [ad, setAd] = useState<AdData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const fetchAd = useCallback(async () => {
    try {
      const response = await fetch('/api/ads?active=true&placement=fullscreen')
      const ads = await response.json()

      if (Array.isArray(ads) && ads.length > 0) {
        setAd(ads[0])
        setIsVisible(true)

        // Track impression
        fetch(`/api/ads/${ads[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'impression' }),
        }).catch(() => {})
      }
    } catch (error) {
      console.error('Failed to fetch fullscreen ad:', error)
    }
  }, [])

  useEffect(() => {
    // Check if banner was already shown in this session
    const shown = sessionStorage.getItem('fullscreen-banner-shown')
    if (shown) return

    // Small delay before showing
    const timer = setTimeout(() => {
      fetchAd()
      sessionStorage.setItem('fullscreen-banner-shown', 'true')
    }, 1500)

    return () => clearTimeout(timer)
  }, [fetchAd])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  const handleClick = () => {
    if (ad?.id) {
      fetch(`/api/ads/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'click' }),
      }).catch(() => {})
    }
  }

  if (!isVisible || !ad) return null

  const content = (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {ad.code ? (
        <div
          className="max-w-[90vw] max-h-[90vh]"
          dangerouslySetInnerHTML={{ __html: ad.code }}
        />
      ) : ad.imageUrl ? (
        <div className="relative max-w-[90vw] max-h-[90vh]">
          <Image
            src={ad.imageUrl}
            alt="Advertisement"
            width={1920}
            height={1080}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
            unoptimized
          />
        </div>
      ) : null}
    </div>
  )

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Ad content */}
      <div
        className={`w-full h-full transition-transform duration-300 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full h-full"
            onClick={handleClick}
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>

      {/* Ad label */}
      <span className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
        РЕКЛАМА
      </span>
    </div>
  )
}
