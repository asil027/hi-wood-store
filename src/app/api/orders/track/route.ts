import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderNumber, contact } = await req.json();

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: 'Please enter both your Order Number and Email or Phone Number.' },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim();
    const cleanContact = contact.trim().toLowerCase();

    const order = await prisma.order.findUnique({
      where: { orderNumber: cleanOrderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found. Please check your order number.' }, { status: 404 });
    }

    // Verify verification detail for privacy
    const matchesEmail = order.customerEmail.toLowerCase() === cleanContact;
    const matchesPhone = order.customerPhone.replace(/[\s-]/g, '').includes(cleanContact.replace(/[\s-]/g, ''));

    if (!matchesEmail && !matchesPhone) {
      return NextResponse.json(
        { error: 'Verification failed. The contact details do not match the order record.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        courierName: order.courierName,
        trackingNumber: order.trackingNumber,
        city: order.city,
        totalAmount: order.totalAmount,
        items: order.items,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
