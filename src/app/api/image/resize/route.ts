import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import sharp from 'sharp'
import path from 'path'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

// Predefined image sizes
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  xl: { width: 1280, height: 960 },
  full: { width: 1920, height: 1440 },
  // Social media sizes
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 675 },
  instagram: { width: 1080, height: 1080 },
} as const

export type ImageSize = keyof typeof IMAGE_SIZES

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')
    const size = searchParams.get('size') as ImageSize
    const format = searchParams.get('format') || 'webp'
    const download = searchParams.get('download') === 'true'

    if (!imagePath) {
      return NextResponse.json({ message: 'Image path is required' }, { status: 400 })
    }

    if (!size || !IMAGE_SIZES[size]) {
      return NextResponse.json(
        { message: `Invalid size. Available: ${Object.keys(IMAGE_SIZES).join(', ')}` },
        { status: 400 }
      )
    }

    // Get absolute path to image
    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''))

    if (!existsSync(fullPath)) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 })
    }

    // Read and process image
    const imageBuffer = await readFile(fullPath)
    const { width, height } = IMAGE_SIZES[size]

    let processedImage = sharp(imageBuffer).resize(width, height, {
      fit: 'cover',
      position: 'center',
    })

    // Set output format
    let contentType = 'image/webp'
    let extension = 'webp'

    switch (format) {
      case 'jpeg':
      case 'jpg':
        processedImage = processedImage.jpeg({ quality: 85 })
        contentType = 'image/jpeg'
        extension = 'jpg'
        break
      case 'png':
        processedImage = processedImage.png({ compressionLevel: 9 })
        contentType = 'image/png'
        extension = 'png'
        break
      case 'webp':
      default:
        processedImage = processedImage.webp({ quality: 85 })
        contentType = 'image/webp'
        extension = 'webp'
        break
    }

    const outputBuffer = await processedImage.toBuffer()

    // Generate filename for download
    const originalName = path.basename(imagePath, path.extname(imagePath))
    const filename = `${originalName}-${size}-${width}x${height}.${extension}`

    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    }

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`
    }

    return new NextResponse(new Uint8Array(outputBuffer), { headers })
  } catch (error) {
    console.error('Error resizing image:', error)
    return NextResponse.json(
      { message: 'Failed to process image' },
      { status: 500 }
    )
  }
}

// Get available sizes endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json({ message: 'Image path is required' }, { status: 400 })
    }

    // Get absolute path to image
    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''))

    if (!existsSync(fullPath)) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 })
    }

    // Get original image metadata
    const imageBuffer = await readFile(fullPath)
    const metadata = await sharp(imageBuffer).metadata()

    const sizes = Object.entries(IMAGE_SIZES).map(([name, dimensions]) => ({
      name,
      ...dimensions,
      label: getSizeLabel(name as ImageSize),
      isLargerThanOriginal: (metadata.width || 0) < dimensions.width || (metadata.height || 0) < dimensions.height,
    }))

    return NextResponse.json({
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
      sizes,
    })
  } catch (error) {
    console.error('Error getting image info:', error)
    return NextResponse.json(
      { message: 'Failed to get image info' },
      { status: 500 }
    )
  }
}

function getSizeLabel(size: ImageSize): string {
  const labels: Record<ImageSize, string> = {
    thumbnail: 'Миниатюра (150x150)',
    small: 'Маленький (320x240)',
    medium: 'Средний (640x480)',
    large: 'Большой (1024x768)',
    xl: 'Очень большой (1280x960)',
    full: 'Полный размер (1920x1440)',
    og: 'Open Graph (1200x630)',
    twitter: 'Twitter (1200x675)',
    instagram: 'Instagram (1080x1080)',
  }
  return labels[size]
}
