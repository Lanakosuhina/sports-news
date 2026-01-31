'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  FolderOpen,
  Image as ImageIcon,
  Download,
  RefreshCw,
  ChevronLeft,
  Loader2,
  Copy,
  Check
} from 'lucide-react'
import ImageDownloadModal from '@/components/admin/ImageDownloadModal'

interface MediaFile {
  name: string
  path: string
  size: number
  modified: string
  type: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState('uploads')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/media?folder=${currentFolder}`)
      const data = await response.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }, [currentFolder])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const copyPath = async (path: string) => {
    await navigator.clipboard.writeText(path)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const navigateToFolder = (folder: string) => {
    setCurrentFolder(`${currentFolder}/${folder}`)
  }

  const navigateBack = () => {
    const parts = currentFolder.split('/')
    if (parts.length > 1) {
      parts.pop()
      setCurrentFolder(parts.join('/'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Медиа библиотека</h1>
          <p className="text-sm text-slate-500 mt-1">
            Просмотр и скачивание изображений
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm"
          >
            {viewMode === 'grid' ? 'Список' : 'Сетка'}
          </button>
          <button
            onClick={fetchMedia}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <button
          onClick={() => setCurrentFolder('uploads')}
          className="text-blue-500 hover:text-blue-600"
        >
          uploads
        </button>
        {currentFolder !== 'uploads' && (
          <>
            {currentFolder.split('/').slice(1).map((part, index, arr) => (
              <span key={index} className="flex items-center gap-2">
                <span className="text-slate-400">/</span>
                <button
                  onClick={() => setCurrentFolder('uploads/' + arr.slice(0, index + 1).join('/'))}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {part}
                </button>
              </span>
            ))}
          </>
        )}
      </div>

      {/* Navigation */}
      {currentFolder !== 'uploads' && (
        <button
          onClick={navigateBack}
          className="flex items-center gap-2 mb-4 text-slate-600 hover:text-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Folders */}
          {folders.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-slate-700 mb-3">Папки</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => navigateToFolder(folder)}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <FolderOpen className="w-10 h-10 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-700 truncate w-full text-center">
                      {folder}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {files.length > 0 ? (
            <div>
              <h2 className="text-sm font-medium text-slate-700 mb-3">
                Изображения ({files.length})
              </h2>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={file.path}
                          alt={file.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedImage(file.path)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                            title="Скачать"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => copyPath(file.path)}
                            className="p-2 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition"
                            title="Копировать путь"
                          >
                            {copiedPath === file.path ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatFileSize(file.size)} • {file.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Превью
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Имя файла
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Размер
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Дата
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {files.map((file) => (
                        <tr key={file.path} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="w-12 h-12 relative rounded overflow-hidden">
                              <Image
                                src={file.path}
                                alt={file.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-900">
                                {file.name}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1 font-mono">
                              {file.path}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatDate(file.modified)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => copyPath(file.path)}
                                className="p-2 text-slate-400 hover:text-slate-600 transition"
                                title="Копировать путь"
                              >
                                {copiedPath === file.path ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setSelectedImage(file.path)}
                                className="p-2 text-blue-500 hover:text-blue-600 transition"
                                title="Скачать в разных размерах"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Изображения не найдены</p>
            </div>
          )}
        </>
      )}

      {/* Download Modal */}
      {selectedImage && (
        <ImageDownloadModal
          imagePath={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}
