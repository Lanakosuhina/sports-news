'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

// Стандартные размеры рекламных блоков (IAB)
const AD_SIZES = {
  // Горизонтальные
  leaderboard: { width: 728, height: 90, label: '728×90' },
  billboard: { width: 970, height: 250, label: '970×250' },
  banner: { width: 468, height: 60, label: '468×60' },
  // Прямоугольные
  'medium-rectangle': { width: 300, height: 250, label: '300×250' },
  'large-rectangle': { width: 336, height: 280, label: '336×280' },
  square: { width: 250, height: 250, label: '250×250' },
  // Вертикальные
  skyscraper: { width: 120, height: 600, label: '120×600' },
  'wide-skyscraper': { width: 160, height: 600, label: '160×600' },
  'half-page': { width: 300, height: 600, label: '300×600' },
} as const

type AdSize = keyof typeof AD_SIZES

interface AdData {
  id: string
  imageUrl: string | null
  linkUrl: string | null
  code: string | null
  size: string
  rotationGroup: string | null
  rotationInterval: number
}

interface AdZoneProps {
  size?: AdSize
  imageSrc?: string
  link?: string
  className?: string
  sticky?: boolean
  placement?: string // Fetch ad by placement from database
  slug?: string // Fetch specific ad by slug
}

export default function AdZone({
  size = 'medium-rectangle',
  imageSrc,
  link,
  className = '',
  sticky = false,
  placement,
  slug,
}: AdZoneProps) {
  const [ads, setAds] = useState<AdData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(!!placement || !!slug)
  const [fade, setFade] = useState(false)
  const rotationTimer = useRef<NodeJS.Timeout | null>(null)
  const impressionTracked = useRef<Set<string>>(new Set())

  const fetchAds = useCallback(async () => {
    try {
      let url = '/api/ads?active=true'
      if (placement) url += `&placement=${placement}`

      const response = await fetch(url)
      const fetchedAds = await response.json()

      if (Array.isArray(fetchedAds) && fetchedAds.length > 0) {
        if (slug) {
          const ad = fetchedAds.find((a: AdData) => a.id === slug)
          if (ad) setAds([ad])
        } else {
          setAds(fetchedAds)
        }
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error)
    } finally {
      setLoading(false)
    }
  }, [placement, slug])

  // Track impression for current ad
  const trackImpression = useCallback((adId: string) => {
    if (impressionTracked.current.has(adId)) return
    impressionTracked.current.add(adId)

    fetch(`/api/ads/${adId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'impression' }),
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (placement || slug) {
      fetchAds()
    }
  }, [placement, slug, fetchAds])

  // Track impression when ads change or index changes
  useEffect(() => {
    if (ads.length > 0 && ads[currentIndex]) {
      trackImpression(ads[currentIndex].id)
    }
  }, [ads, currentIndex, trackImpression])

  // Rotation effect
  useEffect(() => {
    if (ads.length <= 1) return

    const currentAd = ads[currentIndex]
    const interval = currentAd?.rotationInterval || 0

    if (interval <= 0) return

    rotationTimer.current = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length)
        setFade(false)
      }, 300) // Fade duration
    }, interval * 1000)

    return () => {
      if (rotationTimer.current) {
        clearInterval(rotationTimer.current)
      }
    }
  }, [ads, currentIndex])

  const handleClick = () => {
    const currentAd = ads[currentIndex]
    if (currentAd?.id) {
      fetch(`/api/ads/${currentAd.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'click' }),
      }).catch(() => {})
    }
  }

  // Get current ad data
  const adData = ads[currentIndex] || null

  // Use fetched data or props
  const displaySize = (adData?.size as AdSize) || size
  const displayImage = adData?.imageUrl || imageSrc
  const displayLink = adData?.linkUrl || link
  const displayCode = adData?.code

  const { width, height, label } = AD_SIZES[displaySize] || AD_SIZES['medium-rectangle']

  // If still loading, show placeholder
  if (loading) {
    return (
      <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
        <div
          className="bg-slate-100 rounded-lg animate-pulse"
          style={{ width, height }}
        />
      </div>
    )
  }

  // If no ads and no static content, show placeholder
  if (!adData && !imageSrc) {
    return (
      <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
        <div className="w-full flex justify-center">
          <div
            className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex flex-col items-center justify-center"
            style={{ width, height }}
          >
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Реклама</div>
            <div className="text-slate-300 text-lg font-medium">{label}</div>
          </div>
        </div>
      </div>
    )
  }

  // If external ad code is provided, render it
  if (displayCode) {
    return (
      <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
        <div
          className={`relative transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
          style={{ width, height }}
          dangerouslySetInnerHTML={{ __html: displayCode }}
        />
      </div>
    )
  }

  const content = displayImage ? (
    <div className="w-full flex justify-center">
      <div className={`relative rounded-lg overflow-hidden transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={displayImage}
          alt="Реклама"
          width={width}
          height={height}
          className="object-cover"
          unoptimized
        />
        <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
          РЕКЛАМА
        </span>
        {/* Rotation indicator */}
        {ads.length > 1 && (
          <div className="absolute bottom-1 right-1 flex gap-1">
            {ads.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full flex justify-center">
      <div
        className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex flex-col items-center justify-center"
        style={{ width, height }}
      >
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Реклама</div>
        <div className="text-slate-300 text-lg font-medium">{label}</div>
      </div>
    </div>
  )

  const wrapper = (
    <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
      {displayLink ? (
        <a
          href={displayLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block hover:opacity-95 transition"
          onClick={handleClick}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )

  return wrapper
}
