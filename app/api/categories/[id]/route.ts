import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { apiErrors, apiSuccess, apiValidationError } from '@/lib/api/response';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  slug: z.string().trim().min(1, 'Slug is required').optional(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return apiErrors.notFound('Category not found');
    }

    return apiSuccess(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return apiErrors.internal('Failed to fetch category');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return apiErrors.unauthenticated();
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, displayOrder, isActive } = updateCategorySchema.parse(body);

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return apiErrors.notFound('Category not found');
    }

    // If slug is being updated, check for uniqueness
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return apiErrors.conflict('Slug already in use');
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: slug !== undefined ? slug : undefined,
        description: description !== undefined ? description : undefined,
        displayOrder: displayOrder !== undefined ? displayOrder : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return apiSuccess(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    console.error('Error updating category:', error);
    return apiErrors.internal('Failed to update category');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return apiErrors.unauthenticated();
    }

    const { id } = await params;

    // Check if category has articles
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return apiErrors.notFound('Category not found');
    }

    if (category._count.articles > 0) {
      return apiErrors.conflict('Cannot delete category with associated articles');
    }

    await prisma.category.delete({
      where: { id },
    });

    return apiSuccess(null);
  } catch (error) {
    console.error('Error deleting category:', error);
    return apiErrors.internal('Failed to delete category');
  }
}
