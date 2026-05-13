import { describe, it, expect, vi } from "vitest";
import { authConfig } from "../../lib/auth.config";

// Mocking Response and URL for the environment
global.Response = {
  redirect: vi.fn((url) => ({ status: 302, url: url.toString() })),
} as unknown as typeof global.Response;

describe("Auth Middleware (via authConfig.authorized)", () => {
  const authorized = authConfig.callbacks.authorized as unknown as (params: {
    auth: { user: { name: string }; expires: string } | null;
    request: { nextUrl: URL };
  }) => boolean | Response;

  it("should redirect unauthenticated users to login when accessing protected admin routes", () => {
    const nextUrl = new URL("http://localhost:3000/admin/dashboard");
    const result = authorized({
      auth: null,
      request: { nextUrl }
    });
    expect(result).toBe(false);
  });

  it("should allow authenticated users to access protected admin routes", () => {
    const nextUrl = new URL("http://localhost:3000/admin/dashboard");
    const result = authorized({
      auth: { user: { name: "Admin" }, expires: "" },
      request: { nextUrl }
    });
    expect(result).toBe(true);
  });

  it("should allow unauthenticated users to access public auth routes", () => {
    const publicRoutes = [
      "/admin/login",
      "/admin/forgot-password",
      "/admin/reset-password",
      "/admin/accept-invitation"
    ];

    publicRoutes.forEach(route => {
      const nextUrl = new URL(`http://localhost:3000${route}`);
      const result = authorized({
        auth: null,
        request: { nextUrl }
      });
      expect(result).toBe(true);
    });
  });

  it("should redirect authenticated users from login to dashboard", () => {
    const nextUrl = new URL("http://localhost:3000/admin/login");
    authorized({
      auth: { user: { name: "Admin" }, expires: "" },
      request: { nextUrl }
    });

    expect(global.Response.redirect).toHaveBeenCalled();
    const call = vi.mocked(global.Response.redirect).mock.calls[0][0] as URL;
    expect(call.pathname).toBe("/admin/dashboard");
  });

  it("should allow access to non-admin routes for everyone", () => {
    const nextUrl = new URL("http://localhost:3000/");
    const result = authorized({
      auth: null,
      request: { nextUrl }
    });
    expect(result).toBe(true);
  });
});
