import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { AuthService } from "@/features/auth/services/auth-service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await AuthService.validateCredentials(
            credentials.email as string,
            credentials.password as string,
            req.headers?.get("x-forwarded-for") || undefined,
            req.headers?.get("user-agent") || undefined
          );

          return user;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Authentication failed";
          throw new Error(message);
        }
      },
    }),
  ],
});
