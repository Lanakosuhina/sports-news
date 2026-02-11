import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookmakers = await prisma.bookmaker.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(bookmakers)
  } catch (error) {
    console.error('Error fetching bookmakers:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmakers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const bookmaker = await prisma.bookmaker.create({
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo || null,
        description: data.description || null,
        bonus: data.bonus || null,
        bonusLabel: data.bonusLabel || null,
        rating: data.rating || 0,
        link: data.link,
        website: data.website || null,
        hasLicense: data.hasLicense ?? true,
        licenseNumber: data.licenseNumber || null,
        minDeposit: data.minDeposit || null,
        hasIosApp: data.hasIosApp ?? true,
        hasAndroidApp: data.hasAndroidApp ?? true,
        iosAppLink: data.iosAppLink || null,
        androidAppLink: data.androidAppLink || null,
        isActive: data.isActive ?? true,
        order: data.order || 0,
        ratingOrder: data.ratingOrder || 0,
        customFields: data.customFields || null,
        // Promo fields
        promoImage: data.promoImage || null,
        promoTitle: data.promoTitle || null,
        promoDescription: data.promoDescription || null,
        promoCode: data.promoCode || null,
        promoExpiry: data.promoExpiry ? new Date(data.promoExpiry) : null,
        promoLabel: data.promoLabel || null,
        showOnFribet: data.showOnFribet ?? false,
        showOnBezDepozita: data.showOnBezDepozita ?? false,
        showOnPromokodWinline: data.showOnPromokodWinline ?? false,
        showOnPromokodyFonbet: data.showOnPromokodyFonbet ?? false,
        // Page enhancement fields
        headerBackgroundImage: data.headerBackgroundImage || null,
        mobileAppImage: data.mobileAppImage || null,
        textBlocks: data.textBlocks || null,
      },
    })

    return NextResponse.json(bookmaker)
  } catch (error) {
    console.error('Error creating bookmaker:', error)
    return NextResponse.json({ error: 'Failed to create bookmaker' }, { status: 500 })
  }
}
