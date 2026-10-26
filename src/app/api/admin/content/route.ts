import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const raw = await req.json();

    // Map common aliases
    const data: Record<string, any> = {};
    if (raw.heroHeading !== undefined || raw.heroHeadline !== undefined) data.heroHeading = raw.heroHeading || raw.heroHeadline;
    if (raw.heroSubheading !== undefined || raw.heroSubheadline !== undefined) data.heroSubheading = raw.heroSubheading || raw.heroSubheadline;
    if (raw.heroButtonText !== undefined) data.heroButtonText = raw.heroButtonText;
    if (raw.heroImageUrl !== undefined) data.heroImageUrl = raw.heroImageUrl;
    if (raw.promoHeading !== undefined || raw.bannerHeadline !== undefined) data.promoHeading = raw.promoHeading || raw.bannerHeadline;
    if (raw.promoSubheading !== undefined || raw.bannerSubheadline !== undefined) data.promoSubheading = raw.promoSubheading || raw.bannerSubheadline;
    if (raw.promoButtonText !== undefined) data.promoButtonText = raw.promoButtonText;
    if (raw.promoImageUrl !== undefined) data.promoImageUrl = raw.promoImageUrl;
    if (raw.announcementText !== undefined || raw.announcementBarText !== undefined) data.announcementText = raw.announcementText || raw.announcementBarText;
    if (raw.announcementActive !== undefined) data.announcementActive = Boolean(raw.announcementActive);
    if (raw.storeName !== undefined) data.storeName = raw.storeName;
    if (raw.tagline !== undefined) data.tagline = raw.tagline;
    if (raw.contactEmail !== undefined) data.contactEmail = raw.contactEmail;
    if (raw.contactPhone !== undefined) data.contactPhone = raw.contactPhone;
    if (raw.address !== undefined) data.address = raw.address;
    if (raw.standardShippingFee !== undefined) data.standardShippingFee = Number(raw.standardShippingFee);
    if (raw.freeShippingThreshold !== undefined) data.freeShippingThreshold = Number(raw.freeShippingThreshold);
    if (raw.codEnabled !== undefined) data.codEnabled = Boolean(raw.codEnabled);
    if (raw.bankTransferEnabled !== undefined) data.bankTransferEnabled = Boolean(raw.bankTransferEnabled);
    if (raw.bankDetails !== undefined) data.bankDetails = raw.bankDetails;
    if (raw.returnPolicyText !== undefined) data.returnPolicyText = raw.returnPolicyText;
    if (raw.shippingPolicyText !== undefined) data.shippingPolicyText = raw.shippingPolicyText;

    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'UPDATE_CONTENT',
        entity: 'Homepage & Store Settings',
        details: 'Admin updated store content and configuration.',
      },
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath warning:', e);
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
