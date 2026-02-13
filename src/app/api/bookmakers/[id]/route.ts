import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookmaker = await prisma.bookmaker.findUnique({
      where: { id },
    })

    if (!bookmaker) {
      return NextResponse.json({ error: 'Bookmaker not found' }, { status: 404 })
    }

    return NextResponse.json(bookmaker)
  } catch (error) {
    console.error('Error fetching bookmaker:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmaker' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const bookmaker = await prisma.bookmaker.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        description: data.description,
        bonus: data.bonus,
        bonusLabel: data.bonusLabel,
        rating: data.rating,
        link: data.link,
        website: data.website,
        hasLicense: data.hasLicense,
        licenseNumber: data.licenseNumber,
        minDeposit: data.minDeposit,
        hasIosApp: data.hasIosApp,
        hasAndroidApp: data.hasAndroidApp,
        iosAppLink: data.iosAppLink,
        androidAppLink: data.androidAppLink,
        isActive: data.isActive,
        order: data.order,
        ratingOrder: data.ratingOrder,
        // Page-specific order fields
        orderOnFribet: data.orderOnFribet ?? 0,
        orderOnBezDepozita: data.orderOnBezDepozita ?? 0,
        orderOnPromokodWinline: data.orderOnPromokodWinline ?? 0,
        orderOnPromokodyFonbet: data.orderOnPromokodyFonbet ?? 0,
        orderOnBonusPage: data.orderOnBonusPage ?? 0,
        orderOnAppsPage: data.orderOnAppsPage ?? 0,
        orderOnLegalPage: data.orderOnLegalPage ?? 0,
        customFields: data.customFields,
        // Promo fields
        promoImage: data.promoImage || null,
        promoTitle: data.promoTitle || null,
        promoDescription: data.promoDescription || null,
        promoCode: data.promoCode || null,
        promoExpiry: data.promoExpiry ? new Date(data.promoExpiry) : null,
        promoLabel: data.promoLabel || null,
        bonusConditions: data.bonusConditions || null,
        showOnFribet: data.showOnFribet ?? false,
        showOnBezDepozita: data.showOnBezDepozita ?? false,
        showOnPromokodWinline: data.showOnPromokodWinline ?? false,
        showOnPromokodyFonbet: data.showOnPromokodyFonbet ?? false,
        // PromoCard visibility
        showPromoCardOnFribet: data.showPromoCardOnFribet ?? false,
        showPromoCardOnBezDepozita: data.showPromoCardOnBezDepozita ?? false,
        showPromoCardOnPromokodWinline: data.showPromoCardOnPromokodWinline ?? false,
        showPromoCardOnPromokodyFonbet: data.showPromoCardOnPromokodyFonbet ?? false,
        // Page enhancement fields
        headerBackgroundImage: data.headerBackgroundImage || null,
        mobileAppImage: data.mobileAppImage || null,
        textBlocks: data.textBlocks || null,
      },
    })

    return NextResponse.json(bookmaker)
  } catch (error) {
    console.error('Error updating bookmaker:', error)
    return NextResponse.json({ error: 'Failed to update bookmaker' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.bookmaker.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bookmaker:', error)
    return NextResponse.json({ error: 'Failed to delete bookmaker' }, { status: 500 })
  }
}
