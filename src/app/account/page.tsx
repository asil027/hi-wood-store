import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Package, User, MapPin, LogOut, ArrowRight, Truck } from 'lucide-react';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch customer orders
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        { customerEmail: user.email.toLowerCase() },
      ],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
              MY ACCOUNT
            </span>
            <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight mt-0.5">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}
            </p>
          </div>

          <AccountClient user={user} />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
            <h2 className="text-base font-extrabold text-[#111111] flex items-center gap-2">
              <User className="w-5 h-5 text-[#FF5A1F]" />
              <span>Profile Details</span>
            </h2>

            <div className="space-y-3 text-xs text-neutral-600">
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Full Name</span>
                <span>{user.name}</span>
              </div>
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Email Address</span>
                <span>{user.email}</span>
              </div>
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Mobile Phone</span>
                <span>{user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Account Role</span>
                <span className="bg-neutral-100 text-[#111111] px-2.5 py-0.5 rounded-full font-bold">
                  {user.role}
                </span>
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/admin"
                  className="btn-primary w-full text-xs font-bold py-3 text-center"
                >
                  Open Admin Dashboard →
                </Link>
              </div>
            )}
          </div>

          {/* Orders History */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
            <h2 className="text-base font-extrabold text-[#111111] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#FF5A1F]" />
              <span>Order History ({orders.length})</span>
            </h2>

            {orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                <p className="text-sm font-bold text-[#111111]">No orders placed yet</p>
                <p className="text-xs text-neutral-500">
                  When you place an order, it will appear here with live shipping tracking.
                </p>
                <Link href="/shop" className="btn-primary text-xs font-bold inline-block mt-2">
                  Browse Bags
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusColors: Record<string, string> = {
                    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
                    PROCESSING: 'bg-amber-50 text-amber-700 border-amber-200',
                    PENDING: 'bg-neutral-100 text-neutral-700 border-neutral-200',
                    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
                  };

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/40 hover:border-neutral-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/60">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#111111]">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-400 ml-2">
                            {new Date(order.createdAt).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              statusColors[order.orderStatus] || statusColors.PENDING
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <span className="text-sm font-extrabold text-[#111111]">
                            Rs. {order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs text-neutral-600">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {item.productName} <span className="text-neutral-400">× {item.quantity}</span>
                            </span>
                            <span className="font-semibold text-neutral-900">
                              Rs. {item.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Courier & Tracking Footer */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                        <div className="text-neutral-500">
                          {order.courierName && (
                            <span className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                              <span>{order.courierName}: <strong>{order.trackingNumber || 'Pending'}</strong></span>
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/order-confirmation/${order.orderNumber}`}
                          className="font-bold text-[#FF5A1F] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                        >
                          <span>View Receipt Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
