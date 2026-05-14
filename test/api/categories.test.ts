import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/categories/route';
import { PATCH, DELETE } from '@/app/api/categories/[id]/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(async () => ({ user: { id: 'test-user-id', role: 'EDITOR' } })),
}));

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Cat 1', slug: 'cat-1', displayOrder: 1, isActive: true },
      ];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);
      vi.mocked(prisma.category.count).mockResolvedValue(1);

      const req = new NextRequest('http://localhost/api/categories');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockCategories);
      expect(body.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(prisma.category.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: { displayOrder: 'asc' },
        include: { _count: { select: { articles: true } } },
        skip: 0,
        take: 10,
      }));
    });

    it('should return 500 on error', async () => {
      vi.mocked(prisma.category.findMany).mockRejectedValue(new Error('DB error'));

      const req = new NextRequest('http://localhost/api/categories');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.success).toBe(false);
    });
  });

  describe('POST /api/categories', () => {
    it('should fail if unauthorized', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Category' }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Unauthorized');
    });

    it('should create a new category', async () => {
      const payload = { name: 'New Category' };
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.category.create).mockResolvedValue({
        id: '1',
        ...payload,
        slug: 'new-category',
        displayOrder: 0,
        isActive: true,
      } as any);

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.slug).toBe('new-category');
      expect(prisma.category.create).toHaveBeenCalled();
    });

    it('should fail if name is missing', async () => {
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Name is required');
    });

    it('should fail if slug already exists', async () => {
      const payload = { name: 'Cat 1', slug: 'cat-1' };
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 'existing' } as any);

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Category with this slug already exists');
    });
  });

  describe('PATCH /api/categories/[id]', () => {
    it('should fail if unauthorized', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated' }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Unauthorized');
    });

    it('should update a category', async () => {
      const id = '1';
      const payload = { name: 'Updated Name' };
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id, slug: 'old-slug' } as any);
      vi.mocked(prisma.category.update).mockResolvedValue({ id, ...payload } as any);

      const response = await PATCH(req, { params: Promise.resolve({ id }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id },
        data: expect.objectContaining({ name: 'Updated Name' }),
      });
    });

    it('should fail if category not found', async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'test' }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/categories/[id]', () => {
    it('should fail if unauthorized', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Unauthorized');
    });

    it('should delete a category if it has no articles', async () => {
      const id = '1';
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'DELETE',
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({
        id,
        _count: { articles: 0 },
      } as any);

      const response = await DELETE(req, { params: Promise.resolve({ id }) });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should fail to delete if category has articles', async () => {
      const id = '1';
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'DELETE',
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({
        id,
        _count: { articles: 5 },
      } as any);

      const response = await DELETE(req, { params: Promise.resolve({ id }) });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toContain('associated articles');
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });
  });
});
