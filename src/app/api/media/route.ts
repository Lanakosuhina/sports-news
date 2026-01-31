import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// GET - List all media files
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'uploads'

    const uploadsDir = path.join(process.cwd(), 'public', folder)

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [], folders: [] })
    }

    const entries = await readdir(uploadsDir, { withFileTypes: true })

    const files: Array<{
      name: string
      path: string
      size: number
      modified: string
      type: string
    }> = []

    const folders: string[] = []

    for (const entry of entries) {
      if (entry.isDirectory()) {
        folders.push(entry.name)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)

        if (isImage) {
          const filePath = path.join(uploadsDir, entry.name)
          const stats = await stat(filePath)

          files.push({
            name: entry.name,
            path: `/${folder}/${entry.name}`,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: ext.replace('.', ''),
          })
        }
      }
    }

    // Sort by modified date (newest first)
    files.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())

    return NextResponse.json({ files, folders })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 })
  }
}
