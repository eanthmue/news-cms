import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/invite/route';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/features/auth/services/auth-service';
import { Role, AdminUser } from '@prisma/client';
import { mockSession, type AuthGetSession } from '../../helpers/auth-mock';

const { authMock } = vi.hoisted(() => ({
  authMock: vi.fn<AuthGetSession>(),
}));

vi.mock('@/lib/auth', () => ({
  auth: authMock,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminUser: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/features/auth/services/auth-service', () => ({
  AuthService: {
    generateInvitationToken: vi.fn(),
  },
}));

describe('Invite API Route (POST /api/auth/invite)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: Record<string, unknown>) => {
    return new Request('http://localhost:3000/api/auth/invite', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  it('should return 403 if user is not authenticated', async () => {
    authMock.mockResolvedValue(null);

    const req = createRequest({ email: 'test@example.com', name: 'Test User' });
    const response = await POST(req);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 403 if user is not SUPER_ADMIN', async () => {
    authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.EDITOR }));

    const req = createRequest({ email: 'test@example.com', name: 'Test User' });
    const response = await POST(req);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if validation fails', async () => {
    authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.SUPER_ADMIN }));

    const req = createRequest({ email: 'invalid-email', name: '' });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(Array.isArray(data.error)).toBe(true);
  });

  it('should return 400 if user already exists', async () => {
    authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.SUPER_ADMIN }));
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: '1' } as unknown as AdminUser);

    const req = createRequest({ email: 'existing@example.com', name: 'Existing User' });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('User with this email already exists.');
  });

  it('should create user and return success on valid request', async () => {
    authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.SUPER_ADMIN }));
    vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.adminUser.create).mockResolvedValue({ id: 'new-user-1' } as unknown as AdminUser);
    vi.mocked(AuthService.generateInvitationToken).mockResolvedValue('mock-token');

    const req = createRequest({ email: 'new@example.com', name: 'New User', role: 'EDITOR' });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Invitation sent successfully.');

    expect(prisma.adminUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'new@example.com',
        name: 'New User',
        role: 'EDITOR',
        isActive: false,
        password: expect.any(String),
      }),
    });

    expect(AuthService.generateInvitationToken).toHaveBeenCalledWith('new@example.com', 'admin-1');
  });
});
