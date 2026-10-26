import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      name,
      slug,
      sku,
      shortDescription,
      description,
      price,
      salePrice,
      stock,
      categoryId,
      collectionId,
      isFeatured,
      isBestSeller,
      isPublished,
      imageUrl,
    } = body;

    if (!name || price === undefined || price === null || price === '') {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    let autoSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingSlug = await prisma.product.findUnique({ where: { slug: autoSlug } });
    if (existingSlug) {
      autoSlug = `${autoSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let autoSku = sku ? sku.trim().toUpperCase() : `HW-${Math.floor(1000 + Math.random() * 9000)}`;
    const existingSku = await prisma.product.findUnique({ where: { sku: autoSku } });
    if (existingSku) {
      autoSku = `${autoSku}-${Math.floor(10 + Math.random() * 90)}`;
    }

    const finalImage = imageUrl?.trim() || '/images/hero-backpack.png';

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: autoSlug,
        sku: autoSku,
        shortDescription: shortDescription || null,
        description: description || name,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock || '10', 10),
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        images: {
          create: [
            {
              url: finalImage,
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
      },
      include: {
        images: true,
        category: true,
        collection: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'CREATE_PRODUCT',
        entity: `Product ${product.name}`,
        details: `Created SKU ${product.sku} at Rs. ${product.price} (Category: ${product.category?.name || 'None'})`,
      },
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

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
