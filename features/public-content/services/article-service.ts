import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getLatestPublishedArticles = cache(async (limit = 6) => {
  return prisma.article.findMany({
    where: {
      status: "Published",
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      category: true,
      featuredImage: true,
    },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });
});
