import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (cascades to images, variants, wishlists, reviews)
    await prisma.product.delete({
      where: { id },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'DELETE_PRODUCT',
        entity: `Product ${existing.name}`,
        details: `Deleted product SKU ${existing.sku} (ID: ${id})`,
      },
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully', id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      price,
      salePrice,
      stock,
      shortDescription,
      description,
      categoryId,
      collectionId,
      isPublished,
      isFeatured,
      isBestSeller,
      imageUrl,
    } = body;

    // If a new bag image is provided, update or create the primary ProductImage
    if (imageUrl && imageUrl.trim()) {
      const cleanImg = imageUrl.trim();
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: id, isPrimary: true },
      });

      if (existingImg) {
        await prisma.productImage.update({
          where: { id: existingImg.id },
          data: { url: cleanImg },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: cleanImg,
            isPrimary: true,
            displayOrder: 0,
          },
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(price !== undefined && price !== '' ? { price: parseFloat(price) } : {}),
        ...(salePrice !== undefined ? { salePrice: salePrice ? parseFloat(salePrice) : null } : {}),
        ...(stock !== undefined && stock !== '' ? { stock: parseInt(stock, 10) } : {}),
        ...(shortDescription !== undefined ? { shortDescription } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
        ...(collectionId !== undefined ? { collectionId: collectionId || null } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isBestSeller !== undefined ? { isBestSeller: Boolean(isBestSeller) } : {}),
      },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        collection: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'UPDATE_PRODUCT',
        entity: `Product ${updated.name}`,
        details: `Updated product SKU ${updated.sku} (Category: ${updated.category?.name || 'None'})`,
      },
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
