'use client'

import { useState, useEffect } from 'react'
import { X, Download, Loader2, Image as ImageIcon, Monitor, Smartphone } from 'lucide-react'

interface ImageSize {
  name: string
  width: number
  height: number
  label: string
  isLargerThanOriginal: boolean
}

interface ImageInfo {
  original: {
    width: number
    height: number
    format: string
  }
  sizes: ImageSize[]
}

interface ImageDownloadModalProps {
  imagePath: string
  onClose: () => void
}

export default function ImageDownloadModal({ imagePath, onClose }: ImageDownloadModalProps) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'webp' | 'jpg' | 'png'>('webp')

  useEffect(() => {
    const loadImageInfo = async () => {
      try {
        const response = await fetch('/api/image/resize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePath }),
        })

        if (response.ok) {
          const data = await response.json()
          setImageInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch image info:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImageInfo()
  }, [imagePath])

  const handleDownload = async (sizeName: string) => {
    setDownloading(sizeName)
    try {
      const url = `/api/image/resize?path=${encodeURIComponent(imagePath)}&size=${sizeName}&format=${selectedFormat}&download=true`
      const response = await fetch(url)

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl

        // Get filename from content-disposition header or generate one
        const contentDisposition = response.headers.get('content-disposition')
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
        const filename = filenameMatch ? filenameMatch[1] : `image-${sizeName}.${selectedFormat}`

        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(null)
    }
  }

  const getSizeIcon = (name: string) => {
    if (['thumbnail', 'small'].includes(name)) return <Smartphone className="w-4 h-4" />
    if (['og', 'twitter', 'instagram'].includes(name)) return <ImageIcon className="w-4 h-4" />
    return <Monitor className="w-4 h-4" />
  }

  const getSizeCategory = (name: string) => {
    if (['thumbnail', 'small', 'medium'].includes(name)) return 'standard'
    if (['large', 'xl', 'full'].includes(name)) return 'large'
    return 'social'
  }

  const standardSizes = imageInfo?.sizes.filter(s => getSizeCategory(s.name) === 'standard') || []
  const largeSizes = imageInfo?.sizes.filter(s => getSizeCategory(s.name) === 'large') || []
  const socialSizes = imageInfo?.sizes.filter(s => getSizeCategory(s.name) === 'social') || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-900">Скачать изображение</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : imageInfo ? (
            <>
              {/* Original info */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-slate-600">
                  Оригинал: <span className="font-medium text-slate-900">{imageInfo.original.width} x {imageInfo.original.height}</span>
                  <span className="ml-2 text-slate-400">({imageInfo.original.format?.toUpperCase()})</span>
                </div>
              </div>

              {/* Format selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Формат</label>
                <div className="flex gap-2">
                  {(['webp', 'jpg', 'png'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedFormat === format
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard sizes */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Стандартные размеры</h4>
                <div className="space-y-2">
                  {standardSizes.map((size) => (
                    <SizeButton
                      key={size.name}
                      size={size}
                      icon={getSizeIcon(size.name)}
                      downloading={downloading === size.name}
                      onDownload={() => handleDownload(size.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Large sizes */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Большие размеры</h4>
                <div className="space-y-2">
                  {largeSizes.map((size) => (
                    <SizeButton
                      key={size.name}
                      size={size}
                      icon={getSizeIcon(size.name)}
                      downloading={downloading === size.name}
                      onDownload={() => handleDownload(size.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Social media sizes */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Для социальных сетей</h4>
                <div className="space-y-2">
                  {socialSizes.map((size) => (
                    <SizeButton
                      key={size.name}
                      size={size}
                      icon={getSizeIcon(size.name)}
                      downloading={downloading === size.name}
                      onDownload={() => handleDownload(size.name)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Не удалось загрузить информацию об изображении
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SizeButton({
  size,
  icon,
  downloading,
  onDownload,
}: {
  size: ImageSize
  icon: React.ReactNode
  downloading: boolean
  onDownload: () => void
}) {
  return (
    <button
      onClick={onDownload}
      disabled={downloading}
      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>
        <div className="text-left">
          <div className="text-sm font-medium text-slate-900">{size.label}</div>
          <div className="text-xs text-slate-500">
            {size.width} x {size.height}px
            {size.isLargerThanOriginal && (
              <span className="ml-1 text-amber-600">(увеличение)</span>
            )}
          </div>
        </div>
      </div>
      {downloading ? (
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      ) : (
        <Download className="w-5 h-5 text-slate-400" />
      )}
    </button>
  )
}
