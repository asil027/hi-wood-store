import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.toUpperCase().trim();
    const subtotal = parseFloat(searchParams.get('subtotal') || '0');

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
      });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code: rawCode, subtotal = 0 } = await req.json();
    const code = rawCode?.toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
      });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}
