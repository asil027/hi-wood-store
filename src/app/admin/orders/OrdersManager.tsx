'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  X,
  AlertCircle,
} from 'lucide-react';

interface OrdersManagerProps {
  initialOrders: any[];
}

export default function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  // Edit status modal state
  const [newStatus, setNewStatus] = useState('');
  const [newCourier, setNewCourier] = useState('');
  const [newTracking, setNewTracking] = useState('');

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewCourier(order.courierName || 'TCS Express');
    setNewTracking(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          courierName: newCourier,
          trackingNumber: newTracking,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...data.order } : o))
        );
        setSelectedOrder(null);
      }
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['OrderNumber', 'Customer', 'Email', 'City', 'TotalAmount', 'Status', 'Courier', 'Tracking'];
    const rows = filtered.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.city,
      o.totalAmount,
      o.orderStatus,
      o.courierName || '',
      o.trackingNumber || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hiwood_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const statusBadges: Record<string, string> = {
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-amber-50 text-amber-700 border-amber-200',
    PENDING: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search order #, customer, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E8E8] outline-none focus:border-[#FF5A1F]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-[#111111] bg-white border border-[#E8E8E8] rounded-2xl px-4 py-2.5 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="btn-secondary py-2 px-4 text-xs font-bold self-start sm:self-auto inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Order #</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Total (PKR)</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#111111]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#111111] block">{order.customerName}</span>
                    <span className="text-[10px] text-neutral-400">{order.customerEmail}</span>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {order.city}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#111111]">
                    Rs. {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-neutral-700 block">
                      {order.paymentMethod}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        statusBadges[order.orderStatus] || statusBadges.PENDING
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openOrderModal(order)}
                      className="text-xs font-bold text-[#FF5A1F] hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View & Update Order */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E8E8E8] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-[#111111]">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-neutral-400">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-PK')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-[#111111] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs space-y-1.5 text-neutral-700">
              <div>Customer: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})</div>
              <div>Email: <strong>{selectedOrder.customerEmail}</strong></div>
              <div>Address: <strong>{selectedOrder.deliveryAddress}, {selectedOrder.city}</strong></div>
              {selectedOrder.deliveryNotes && (
                <div>Notes: <span className="italic">{selectedOrder.deliveryNotes}</span></div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#111111]">Ordered Items:</h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl p-3">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="py-2 flex justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-bold text-[#111111]">Rs. {item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form to update fulfillment status */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs pt-2 border-t border-gray-100">
              <h4 className="font-bold text-[#111111]">Update Fulfillment Status</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white font-bold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Courier Service</label>
                  <select
                    value={newCourier}
                    onChange={(e) => setNewCourier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white"
                  >
                    <option value="TCS Express">TCS Express</option>
                    <option value="Leopards Courier">Leopards Courier</option>
                    <option value="Trax Logistics">Trax Logistics</option>
                    <option value="Call Courier">Call Courier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  placeholder="e.g. TCS-982310"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary py-2 px-6 text-xs font-bold"
                >
                  {updating ? 'Updating...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
