import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
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
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
