import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/categories/route';
import { GET as GET_BY_ID, PATCH, DELETE } from '@/app/api/categories/[id]/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { mockSession, type AuthGetSession } from '../helpers/auth-mock';
import { Role } from '@prisma/client';

const { authMock } = vi.hoisted(() => ({
  authMock: vi.fn<AuthGetSession>(),
}));

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
  auth: authMock,
}));

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession({ role: Role.EDITOR }));
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Cat 1', slug: 'cat-1', displayOrder: 1, isActive: true },
      ];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as never);
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

    it('E.1: respects custom page/limit params', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([]);
      vi.mocked(prisma.category.count).mockResolvedValue(0);

      const req = new NextRequest('http://localhost/api/categories?page=2&limit=5');
      await GET(req);

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
    });

    it('E.2: returns empty list when no categories exist', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([]);
      vi.mocked(prisma.category.count).mockResolvedValue(0);

      const req = new NextRequest('http://localhost/api/categories');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual([]);
      expect(body.meta.total).toBe(0);
    });
  });

  describe('POST /api/categories', () => {
    it('should fail if unauthorized', async () => {
      authMock.mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Category' }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHENTICATED');
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
      } as never);

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
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
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(body.error.fieldErrors.name)).toBe(true);
    });

    it('should fail if slug already exists', async () => {
      const payload = { name: 'Cat 1', slug: 'cat-1' };
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 'existing' } as never);

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error.message).toBe('Category with this slug already exists');
    });

    it('E.3: auto-generates slug from name when slug not provided', async () => {
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
      } as never);

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.data.slug).toBe('new-category');
    });

    it('E.4: accepts optional fields (description, displayOrder, isActive)', async () => {
      const payload = {
        name: 'Tech',
        description: 'Technology news',
        displayOrder: 10,
        isActive: false,
      };
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.category.create).mockResolvedValue({
        id: '1',
        ...payload,
        slug: 'tech',
      } as never);

      const response = await POST(req);
      expect(response.status).toBe(201);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining(payload),
      });
    });
  });

  describe('PATCH /api/categories/[id]', () => {
    it('should fail if unauthorized', async () => {
      authMock.mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated' }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('should update a category', async () => {
      const id = '1';
      const payload = { name: 'Updated Name' };
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id, slug: 'old-slug' } as never);
      vi.mocked(prisma.category.update).mockResolvedValue({ id, ...payload } as never);

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

    it('E.5: returns 400 when new slug conflicts with existing category', async () => {
      const id = '1';
      const payload = { slug: 'existing-slug' };
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique)
        .mockResolvedValueOnce({ id, slug: 'old-slug' } as never) // existingCategory check
        .mockResolvedValueOnce({ id: 'other', slug: 'existing-slug' } as never); // slugExists check

      const response = await PATCH(req, { params: Promise.resolve({ id }) });
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error.message).toBe('Slug already in use');
    });

    it('E.6: does partial update (only description, no name/slug)', async () => {
      const id = '1';
      const payload = { description: 'New description' };
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({
        id,
        name: 'Cat 1',
        slug: 'cat-1',
      } as never);
      vi.mocked(prisma.category.update).mockResolvedValue({ id, ...payload } as never);

      const response = await PATCH(req, { params: Promise.resolve({ id }) });
      expect(response.status).toBe(200);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          name: undefined,
          slug: undefined,
          description: 'New description',
          displayOrder: undefined,
          isActive: undefined,
        },
      });
    });
  });

  describe('DELETE /api/categories/[id]', () => {
    it('should fail if unauthorized', async () => {
      authMock.mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('should delete a category if it has no articles', async () => {
      const id = '1';
      const req = new NextRequest(`http://localhost/api/categories/${id}`, {
        method: 'DELETE',
      });

      vi.mocked(prisma.category.findUnique).mockResolvedValue({
        id,
        _count: { articles: 0 },
      } as never);

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
      } as never);

      const response = await DELETE(req, { params: Promise.resolve({ id }) });
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error.message).toContain('associated articles');
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('E.7: returns 404 when category does not exist', async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/categories/1', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/categories/[id]', () => {
    it('2.1: returns category by id with article count (200)', async () => {
      const id = '1';
      const mockCategory = {
        id,
        name: 'Cat 1',
        slug: 'cat-1',
        _count: { articles: 5 },
      };
      vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as never);

      const req = new NextRequest(`http://localhost/api/categories/${id}`);
      const response = await GET_BY_ID(req, {
        params: Promise.resolve({ id }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockCategory);
    });

    it('2.2: returns 404 when category does not exist', async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/categories/non-existent');
      const response = await GET_BY_ID(req, {
        params: Promise.resolve({ id: 'non-existent' }),
      });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
    });
  });
});
