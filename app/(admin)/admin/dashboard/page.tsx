"use client";

import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold">Welcome, {session?.user?.name || "Admin"}!</h2>
        <p className="mt-2 text-zinc-500">
          You are logged in as a <strong>{session?.user?.role}</strong>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-500">Total Articles</h3>
          <p className="mt-2 text-3xl font-bold">--</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-500">Total Categories</h3>
          <p className="mt-2 text-3xl font-bold">--</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-500">Pending Comments</h3>
          <p className="mt-2 text-3xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
}
