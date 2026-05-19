import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/articles/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('Articles API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/articles', () => {
    it('should return paginated published articles with meta', async () => {
      const mockArticles = [
        { id: '1', title: 'Article 1', status: 'Published' },
        { id: '2', title: 'Article 2', status: 'Published' },
      ];
      vi.mocked(prisma.article.findMany).mockResolvedValue(mockArticles as any);
      vi.mocked(prisma.article.count).mockResolvedValue(2);

      const req = new NextRequest('http://localhost/api/articles?page=1&limit=2');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual(mockArticles);
      expect(body.meta).toEqual({
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      });
      expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=60, stale-while-revalidate=300');
    });

    it('should apply page/limit query params correctly', async () => {
      vi.mocked(prisma.article.findMany).mockResolvedValue([]);
      vi.mocked(prisma.article.count).mockResolvedValue(0);

      const req = new NextRequest('http://localhost/api/articles?page=2&limit=5');
      await GET(req);

      expect(prisma.article.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 5,
        take: 5,
      }));
    });

    it('should return empty list when no published articles exist', async () => {
      vi.mocked(prisma.article.findMany).mockResolvedValue([]);
      vi.mocked(prisma.article.count).mockResolvedValue(0);

      const req = new NextRequest('http://localhost/api/articles');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual([]);
      expect(body.meta.total).toBe(0);
    });

    it('should return 500 on prisma error', async () => {
      vi.mocked(prisma.article.findMany).mockRejectedValue(new Error('DB error'));

      const req = new NextRequest('http://localhost/api/articles');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe('Internal Server Error');
    });
  });
});
