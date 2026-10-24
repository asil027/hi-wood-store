import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { name, slug, description, image } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    let finalSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      // If already exists, return it
      return NextResponse.json({ success: true, category: existing, message: 'Category already exists' });
    }

    const count = await prisma.category.count();

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || `Collection of premium ${name.toLowerCase()}`,
        image: image || null,
        displayOrder: count,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminEmail: admin.email,
        action: 'CREATE_CATEGORY',
        entity: `Category ${category.name}`,
        details: `Created bag category slug: ${category.slug}`,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
