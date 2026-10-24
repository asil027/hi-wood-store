import React from 'react';
import { prisma } from '@/lib/prisma';
import OrdersManager from './OrdersManager';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Order Management
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Review nationwide orders, update fulfillment statuses, and record courier tracking numbers.
        </p>
      </div>

      <OrdersManager initialOrders={orders} />
    </div>
  );
}
