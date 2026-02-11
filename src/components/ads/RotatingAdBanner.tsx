'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Ad {
  id: string
  name: string
  imageUrl: string | null
  linkUrl: string | null
  code: string | null
  rotationInterval: number
}

interface RotatingAdBannerProps {
  rotationGroup: string
  className?: string
  width?: number
  height?: number
}

export default function RotatingAdBanner({
  rotationGroup,
  className = '',
  width = 300,
  height = 250,
}: RotatingAdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch ads for this rotation group
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          `/api/ads?rotationGroup=${encodeURIComponent(rotationGroup)}&active=true`
        )
        if (response.ok) {
          const data = await response.json()
          setAds(data)
        }
      } catch (error) {
        console.error('Failed to fetch rotating ads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [rotationGroup])

  // Track impression
  const trackImpression = useCallback(async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'impression' }),
      })
    } catch (error) {
      console.error('Failed to track impression:', error)
    }
  }, [])

  // Track click
  const trackClick = useCallback(async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'click' }),
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }, [])

  // Rotate ads
  useEffect(() => {
    if (ads.length <= 1) return

    const currentAd = ads[currentIndex]
    const interval = (currentAd?.rotationInterval || 5) * 1000

    if (interval <= 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, interval)

    return () => clearInterval(timer)
  }, [ads, currentIndex])

  // Track impression when ad changes
  useEffect(() => {
    if (ads.length > 0 && ads[currentIndex]) {
      trackImpression(ads[currentIndex].id)
    }
  }, [ads, currentIndex, trackImpression])

  if (loading) {
    return (
      <div
        className={`bg-slate-100 animate-pulse rounded-lg ${className}`}
        style={{ width, height }}
      />
    )
  }

  if (ads.length === 0) {
    return null
  }

  const currentAd = ads[currentIndex]

  if (!currentAd) return null

  // If ad has code, render it
  if (currentAd.code) {
    return (
      <div
        className={`relative ${className}`}
        style={{ width, height }}
        dangerouslySetInnerHTML={{ __html: currentAd.code }}
      />
    )
  }

  // If ad has image, render it
  if (currentAd.imageUrl) {
    const content = (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ width, height }}
      >
        <Image
          src={currentAd.imageUrl}
          alt={currentAd.name}
          fill
          className="object-cover transition-opacity duration-500"
          unoptimized
        />
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )

    if (currentAd.linkUrl) {
      return (
        <a
          href={currentAd.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(currentAd.id)}
        >
          {content}
        </a>
      )
    }

    return content
  }

  return null
}
