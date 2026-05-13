"use client";

import { useState } from "react";
import { UserTable } from "@/features/users/components/UserTable";
import { InviteUserDialog } from "@/features/users/components/InviteUserDialog";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== Role.SUPER_ADMIN) {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (session?.user?.role !== Role.SUPER_ADMIN) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage admin users, roles, and invitations.
          </p>
        </div>
        <InviteUserDialog onSuccess={handleRefresh} />
      </div>

      <UserTable key={refreshKey} />
    </div>
  );
}
