import Image from 'next/image';
import { getLatestPublishedArticles } from '@/features/public-content/services/article-service';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await getLatestPublishedArticles(6);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center justify-start bg-white px-8 py-16 sm:items-start dark:bg-black">
        <Image
          className="mb-8 dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="mb-12 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Latest News
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to our News CMS. Published stories are rendered on the server for fast,
            crawlable public pages.
          </p>
        </div>

        <div className="w-full">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div key={article.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
                    {article.category.name}
                  </span>
                  <h2 className="mt-2 text-xl font-bold leading-tight">{article.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-3">{article.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <p className="text-zinc-500">No articles found. Add some in the CMS!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
