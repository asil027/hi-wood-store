import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, categories] = await Promise.all([
      prisma.storeSettings.findUnique({ where: { id: 'default' } }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      settings: settings || {
        storeName: 'Hiwood',
        tagline: 'Carry Your World',
        contactEmail: 'support@hiwood.pk',
        contactPhone: '+92 300 1234567',
        address: 'Plot 42, Sector 15, Korangi Industrial Area, Karachi, Pakistan',
        currency: 'Rs.',
        standardShippingFee: 250,
        freeShippingThreshold: 3000,
        codEnabled: true,
        bankTransferEnabled: true,
        bankDetails:
          'Bank: Meezan Bank Ltd\nAccount Title: Hiwood Bags Private Limited\nAccount Number: 01020304050607\nIBAN: PK65MEZN0001020304050607',
      },
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
