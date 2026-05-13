import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isAuthPage = nextUrl.pathname.startsWith("/admin/login");

      if (isAdminRoute && !isAuthPage) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }
      return true;
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
        session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [], // Add providers with window-level runtime (Node.js) in auth.ts
} satisfies NextAuthConfig;
