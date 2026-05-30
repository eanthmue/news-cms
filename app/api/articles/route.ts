import { prisma } from '@/lib/prisma';
import { apiErrors, apiSuccess } from '@/lib/api/response';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
    const limitParam = Number.parseInt(searchParams.get('limit') || '10', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = Number.isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'Published',
          publishedAt: {
            lte: new Date(),
          },
        },
        include: {
          category: true,
          featuredImage: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          status: 'Published',
          publishedAt: {
            lte: new Date(),
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiSuccess(articles, {
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
    console.error('Error fetching articles:', error);
    return apiErrors.internal();
  }
}
