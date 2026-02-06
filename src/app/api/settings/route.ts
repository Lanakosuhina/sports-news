import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          siteName: 'Тренды спорта',
          siteDescription: 'Спортивное медиа',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      siteName,
      siteDescription,
      logo,
      favicon,
      socialFacebook,
      socialTwitter,
      socialInstagram,
      socialYoutube,
      analyticsCode,
    } = data

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName,
        siteDescription,
        logo,
        favicon,
        socialFacebook,
        socialTwitter,
        socialInstagram,
        socialYoutube,
        analyticsCode,
      },
      create: {
        id: 'default',
        siteName,
        siteDescription,
        logo,
        favicon,
        socialFacebook,
        socialTwitter,
        socialInstagram,
        socialYoutube,
        analyticsCode,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
