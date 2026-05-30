import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/forgot-password/route';
import { AuthService } from '@/features/auth/services/auth-service';
import { NextRequest } from 'next/server';

vi.mock('@/features/auth/services/auth-service', () => ({
  AuthService: {
    generatePasswordResetToken: vi.fn(),
  },
}));

describe('Forgot Password API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return generic success for existing email', async () => {
    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    vi.mocked(AuthService.generatePasswordResetToken).mockResolvedValue('token');

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.message).toContain('If an account with that email exists');
  });

  it('should return generic success for non-existing email', async () => {
    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
    });

    vi.mocked(AuthService.generatePasswordResetToken).mockResolvedValue(null);

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.message).toContain('If an account with that email exists');
  });

  it('should return 400 when email format is invalid', async () => {
    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 500 on unexpected error', async () => {
    const req = new NextRequest('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    vi.mocked(AuthService.generatePasswordResetToken).mockRejectedValue(new Error('Unexpected'));

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.message).toBe('An unexpected error occurred.');
  });
});
