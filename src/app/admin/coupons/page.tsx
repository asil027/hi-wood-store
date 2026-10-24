import React from 'react';
import { prisma } from '@/lib/prisma';
import { TicketPercent, Plus, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#111111]">
            Coupons & Promotional Discounts
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure discount promo codes, usage limits, and minimum cart amounts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-6">Discount</th>
                <th className="py-4 px-6">Min Order Amount</th>
                <th className="py-4 px-6">Times Used</th>
                <th className="py-4 px-6">Usage Limit</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#FF5A1F]">
                    {c.code}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#111111]">
                    {c.discountType === 'PERCENT' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} FLAT OFF`}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {c.minOrderAmount > 0 ? `Rs. ${c.minOrderAmount.toLocaleString()}` : 'No minimum'}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#111111]">
                    {c.timesUsed} times
                  </td>
                  <td className="py-4 px-6">
                    {c.usageLimit ? `${c.usageLimit} total` : 'Unlimited'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
