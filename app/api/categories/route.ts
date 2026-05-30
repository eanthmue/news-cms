import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { apiErrors, apiSuccess, apiValidationError } from '@/lib/api/response';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z.string().trim().optional(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
    const limitParam = Number.parseInt(searchParams.get('limit') || '10', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = Number.isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: {
            select: { articles: true },
          },
        },
        skip,
        take: limit,
      }),
      prisma.category.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiSuccess(categories, {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return apiErrors.internal('Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return apiErrors.unauthenticated();
    }

    const body = await request.json();
    const parsedBody = createCategorySchema.parse(body);
    const { name, description, displayOrder, isActive } = parsedBody;
    let { slug } = parsedBody;

    if (!slug) {
      slug = slugify(name);
    }

    // Check for uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return apiErrors.conflict('Category with this slug already exists');
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return apiSuccess(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    console.error('Error creating category:', error);
    return apiErrors.internal('Failed to create category');
  }
}
