import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      // Define public auth routes that don't require session
      const publicAuthRoutes = [
        "/admin/login",
        "/admin/forgot-password",
        "/admin/reset-password",
        "/admin/accept-invitation",
      ];

      const isPublicAuthRoute = publicAuthRoutes.some(route =>
        nextUrl.pathname.startsWith(route)
      );

      if (!isAdminRoute) return true;

      if (isPublicAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with window-level runtime (Node.js) in auth.ts
} satisfies NextAuthConfig;
