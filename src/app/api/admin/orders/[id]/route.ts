import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { orderStatus, paymentStatus, courierName, trackingNumber } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(courierName !== undefined ? { courierName } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'UPDATE_ORDER_STATUS',
        entity: `Order ${order.orderNumber}`,
        details: `Updated status to ${orderStatus || 'unchanged'}, courier: ${courierName || 'none'}`,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
