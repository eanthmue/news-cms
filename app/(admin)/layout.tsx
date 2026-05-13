'use client';

import React from 'react';
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Admin CMS</h2>
        </div>
        <nav className="space-y-2">
          <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
