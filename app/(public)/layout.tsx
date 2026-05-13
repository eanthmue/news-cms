'use client';

import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 py-4 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">News Website</h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} News CMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
