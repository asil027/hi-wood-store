import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userName, rating, comment } = await req.json();

    if (!userName || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    const currentUser = await getCurrentUser();

    const review = await prisma.review.create({
      data: {
        productId: id,
        userId: currentUser?.id || null,
        userName: userName.trim(),
        userEmail: currentUser?.email || null,
        rating: Number(rating) || 5,
        comment: comment.trim(),
        isApproved: true,
      },
    });

    // Update product rating average
    const allReviews = await prisma.review.findMany({
      where: { productId: id, isApproved: true },
    });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
