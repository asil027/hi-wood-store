import React from 'react';
import { prisma } from '@/lib/prisma';
import { Star, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Customer Reviews & Moderation
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Review authentic Pakistani buyer feedback, ratings, and testimonials.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Reviewer</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Comment</th>
                <th className="py-4 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#111111]">
                    {r.product?.name || 'Backpack'}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {r.userName}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-sm text-neutral-700 leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </td>
                  <td className="py-4 px-6 text-right text-neutral-400">
                    {new Date(r.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                    })}
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
