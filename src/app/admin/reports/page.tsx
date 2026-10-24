import React from 'react';
import { prisma } from '@/lib/prisma';
import { BarChart3, TrendingUp, DollarSign, Package, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.product.findMany({ include: { orderItems: true } }),
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Breakdown by status
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Analytics & Performance Reports
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Detailed sales statistics, average order values, and fulfillment efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Gross Sales</span>
          <div className="text-3xl font-extrabold text-[#111111]">Rs. {totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 font-bold">100% verified database transactions</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="text-3xl font-extrabold text-[#111111]">Rs. {aov.toLocaleString()}</div>
          <p className="text-xs text-neutral-500 font-medium">Calculated across {totalOrders} shipments</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Units Dispatched</span>
          <div className="text-3xl font-extrabold text-[#111111]">
            {orders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0), 0)}
          </div>
          <p className="text-xs text-[#FF5A1F] font-bold">Nationwide Pakistan Fulfillment</p>
        </div>
      </div>

      {/* Orders by Status Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-[#111111]">
          Orders Fulfillment Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-100 text-center">
              <span className="text-xs font-bold text-neutral-400 uppercase block mb-1">{status}</span>
              <span className="text-2xl font-extrabold text-[#111111]">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
