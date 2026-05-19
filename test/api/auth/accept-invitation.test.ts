import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/accept-invitation/route';
import { AuthService } from '@/features/auth/services/auth-service';
import { NextRequest } from 'next/server';

vi.mock('@/features/auth/services/auth-service', () => ({
  AuthService: {
    acceptInvitation: vi.fn(),
  },
}));

describe('Accept Invitation API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept valid invitation', async () => {
    const payload = { token: 'valid-token', password: 'password123', name: 'New User' };
    const req = new NextRequest('http://localhost/api/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    vi.mocked(AuthService.acceptInvitation).mockResolvedValue(undefined);

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Invitation accepted successfully. You can now log in.');
    expect(AuthService.acceptInvitation).toHaveBeenCalledWith('valid-token', 'password123', 'New User');
  });

  it('should return 400 when token is empty', async () => {
    const req = new NextRequest('http://localhost/api/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token: '', password: 'password123', name: 'New User' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 when password is too short', async () => {
    const req = new NextRequest('http://localhost/api/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token: 'token', password: 'short', name: 'New User' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 when name is empty', async () => {
    const req = new NextRequest('http://localhost/api/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token: 'token', password: 'password123', name: '' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 when AuthService.acceptInvitation throws', async () => {
    const req = new NextRequest('http://localhost/api/auth/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid', password: 'password123', name: 'Name' }),
    });

    vi.mocked(AuthService.acceptInvitation).mockRejectedValue(new Error('Invalid or expired invitation token'));

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Invalid or expired invitation token');
  });
});
