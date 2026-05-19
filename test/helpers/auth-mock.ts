import type { Session } from "next-auth";
import type { Role } from "@prisma/client";
/** Auth.js `auth` has middleware overloads; use this type when mocking session lookups in tests. */
export type AuthGetSession = () => Promise<Session | null>;

export function mockSession(user: {
  id?: string;
  role: Role;
  email?: string;
  name?: string;
}): Session {
  return {
    user: {
      id: user.id ?? "test-user-id",
      role: user.role,
      email: user.email ?? "test@example.com",
      name: user.name ?? "Test User",
    },
    expires: new Date(Date.now() + 86_400_000).toISOString(),
  };
}
