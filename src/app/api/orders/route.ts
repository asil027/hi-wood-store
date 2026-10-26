import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress: rawDeliveryAddress,
      shippingAddress,
      city,
      deliveryNotes,
      paymentMethod = 'COD',
      couponCode,
      items,
    } = body;

    const deliveryAddress = rawDeliveryAddress || shippingAddress;

    // 1. Basic validation
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !city) {
      return NextResponse.json({ error: 'Please provide all delivery information' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const currentUser = await getCurrentUser();

    // 2. Database transaction to validate stock, re-calculate prices, deduct stock, and create order
    const result = await prisma.$transaction(async (tx) => {
      let serverSubtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        // Query product from database
        let dbProduct = null;
        if (item.productId) {
          dbProduct = await tx.product.findUnique({
            where: { id: item.productId },
            include: { variants: true },
          });
        }
        if (!dbProduct && item.slug) {
          dbProduct = await tx.product.findUnique({
            where: { slug: item.slug },
            include: { variants: true },
          });
        }
        if (!dbProduct && item.name) {
          dbProduct = await tx.product.findFirst({
            where: { name: item.name },
            include: { variants: true },
          });
        }

        if (!dbProduct) {
          throw new Error(`Product "${item.name}" is no longer available.`);
        }

        if (dbProduct.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} remaining.`);
        }

        // Deduct product stock
        await tx.product.update({
          where: { id: dbProduct.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Use actual server pricing
        const unitPrice = dbProduct.salePrice && dbProduct.salePrice > 0 ? dbProduct.salePrice : dbProduct.price;
        const lineTotal = unitPrice * item.quantity;
        serverSubtotal += lineTotal;

        orderItemsData.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          image: item.image || '/images/hero-backpack.png',
          price: unitPrice,
          quantity: item.quantity,
          color: item.color || null,
          size: item.size || null,
          total: lineTotal,
        });
      }

      // 3. Coupon validation & discount calculation
      let discountAmount = 0;
      let validCouponCode = null;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });

        if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
          if (!coupon.minOrderAmount || serverSubtotal >= coupon.minOrderAmount) {
            if (!coupon.usageLimit || coupon.timesUsed < coupon.usageLimit) {
              validCouponCode = coupon.code;
              if (coupon.discountType === 'PERCENT') {
                discountAmount = Math.round((serverSubtotal * coupon.discountValue) / 100);
              } else {
                discountAmount = Math.min(coupon.discountValue, serverSubtotal);
              }
              // Increment coupon usage
              await tx.coupon.update({
                where: { id: coupon.id },
                data: { timesUsed: { increment: 1 } },
              });
            }
          }
        }
      }

      // 4. Shipping calculation
      const storeSettings = await tx.storeSettings.findUnique({ where: { id: 'default' } });
      const freeThreshold = storeSettings?.freeShippingThreshold ?? 3000;
      const stdFee = storeSettings?.standardShippingFee ?? 250;
      const shippingFee = serverSubtotal >= freeThreshold ? 0 : stdFee;
      const totalAmount = Math.max(0, serverSubtotal - discountAmount + shippingFee);

      // 5. Generate unique Order Number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `HW-${new Date().getFullYear()}-${randomSuffix}`;

      // 6. Create Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: currentUser?.id || null,
          customerName: customerName.trim(),
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          city: city.trim(),
          deliveryNotes: deliveryNotes ? deliveryNotes.trim() : null,
          paymentMethod,
          paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
          orderStatus: 'PENDING',
          subtotal: serverSubtotal,
          discountAmount,
          couponCode: validCouponCode,
          shippingFee,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        totalAmount: result.totalAmount,
        customerEmail: result.customerEmail,
        customerName: result.customerName,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 400 });
  }
}
