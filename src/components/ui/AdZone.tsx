'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

// Standard IAB ad sizes
const AD_SIZES = {
  // Horizontal
  leaderboard: { width: 728, height: 90, label: '728×90' },
  billboard: { width: 970, height: 250, label: '970×250' },
  banner: { width: 468, height: 60, label: '468×60' },
  // Rectangle
  'medium-rectangle': { width: 300, height: 250, label: '300×250' },
  'large-rectangle': { width: 336, height: 280, label: '336×280' },
  square: { width: 250, height: 250, label: '250×250' },
  // Vertical
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
  const [adData, setAdData] = useState<AdData | null>(null)
  const [loading, setLoading] = useState(!!placement || !!slug)

  const fetchAd = useCallback(async () => {
    try {
      let url = '/api/ads?active=true'
      if (placement) url += `&placement=${placement}`

      const response = await fetch(url)
      const ads = await response.json()

      if (Array.isArray(ads) && ads.length > 0) {
        const ad = slug ? ads.find((a: AdData) => a.id === slug) : ads[0]
        if (ad) {
          setAdData(ad)
          // Track impression
          fetch(`/api/ads/${ad.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'impression' }),
          }).catch(() => {})
        }
      }
    } catch (error) {
      console.error('Failed to fetch ad:', error)
    } finally {
      setLoading(false)
    }
  }, [placement, slug])

  useEffect(() => {
    if (placement || slug) {
      fetchAd()
    }
  }, [placement, slug, fetchAd])

  const handleClick = () => {
    if (adData?.id) {
      fetch(`/api/ads/${adData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'click' }),
      }).catch(() => {})
    }
  }

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

  // If external ad code is provided, render it
  if (displayCode) {
    return (
      <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
        <div
          className="relative"
          style={{ width, height }}
          dangerouslySetInnerHTML={{ __html: displayCode }}
        />
      </div>
    )
  }

  const content = displayImage ? (
    <div className="w-full flex justify-center">
      <div className="relative rounded-lg overflow-hidden" >
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
