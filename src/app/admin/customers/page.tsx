import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Customer Directory
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Registered accounts and shoppers across Pakistan.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Mobile Phone</th>
                <th className="py-4 px-6">Total Orders</th>
                <th className="py-4 px-6">Total Spent (PKR)</th>
                <th className="py-4 px-6 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((acc, o) => acc + o.totalAmount, 0);

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5A1F] font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-[#111111]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">{c.email}</td>
                    <td className="py-4 px-6 font-mono">{c.phone || '—'}</td>
                    <td className="py-4 px-6 font-bold text-[#111111]">{c.orders.length} orders</td>
                    <td className="py-4 px-6 font-extrabold text-[#111111]">
                      Rs. {totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-400">
                      {new Date(c.createdAt).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
