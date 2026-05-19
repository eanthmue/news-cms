import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/reset-password/route';
import { AuthService } from '@/features/auth/services/auth-service';
import { NextRequest } from 'next/server';

vi.mock('@/features/auth/services/auth-service', () => ({
  AuthService: {
    resetPassword: vi.fn(),
  },
}));

describe('Reset Password API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reset password with valid token', async () => {
    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'valid-token', password: 'new-password123' }),
    });

    vi.mocked(AuthService.resetPassword).mockResolvedValue(undefined);

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Password has been reset successfully.');
  });

  it('should return 400 when token is empty', async () => {
    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: '', password: 'new-password123' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 when password is too short', async () => {
    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'token', password: 'short' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 when AuthService.resetPassword throws', async () => {
    const req = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid', password: 'new-password123' }),
    });

    vi.mocked(AuthService.resetPassword).mockRejectedValue(new Error('Invalid or expired reset token'));

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Invalid or expired reset token');
  });
});
