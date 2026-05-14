import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'Published',
        },
        include: {
          category: true,
          featuredImage: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          status: 'Published',
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        data: articles,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
