import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/users/route';
import { PATCH, DELETE } from '@/app/api/users/[id]/route';
import { auth } from '@/lib/auth';
import { UserService } from '@/features/users/services/user-service';
import { AdminUser, Role } from '@prisma/client';
import { mockSession, type AuthGetSession } from '../helpers/auth-mock';

const { authMock } = vi.hoisted(() => ({
  authMock: vi.fn<AuthGetSession>(),
}));

vi.mock('@/lib/auth', () => ({
  auth: authMock,
}));

vi.mock('@/features/users/services/user-service', () => ({
  UserService: {
    listUsers: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe('Users API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return 403 if not authenticated or not SUPER_ADMIN', async () => {
      authMock.mockResolvedValue(null);
      const req = new Request('http://localhost:3000/api/users');
      const response = await GET(req);
      expect(response.status).toBe(403);

      authMock.mockResolvedValue(mockSession({ role: Role.EDITOR }));
      const response2 = await GET(req);
      expect(response2.status).toBe(403);
    });

    it('should return list of users on success', async () => {
      authMock.mockResolvedValue(mockSession({ role: Role.SUPER_ADMIN }));
      const mockResult = { users: [], total: 0, page: 1, limit: 10 };
      vi.mocked(UserService.listUsers).mockResolvedValue(mockResult);

      const req = new Request('http://localhost:3000/api/users?search=test&role=EDITOR');
      const response = await GET(req);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockResult);
      expect(UserService.listUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'test',
        role: Role.EDITOR,
      });
    });
  });

  describe('PATCH /api/users/[id]', () => {
    it('should return 403 if not SUPER_ADMIN', async () => {
      authMock.mockResolvedValue(mockSession({ role: Role.EDITOR }));
      const req = new Request('http://localhost:3000/api/users/1', {
        method: 'PATCH',
        body: JSON.stringify({ isActive: false }),
      });
      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(403);
    });

    it('should return 400 on validation error', async () => {
      authMock.mockResolvedValue(mockSession({ role: Role.SUPER_ADMIN }));
      const req = new Request('http://localhost:3000/api/users/1', {
        method: 'PATCH',
        body: JSON.stringify({ role: 'INVALID_ROLE' }),
      });
      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(400);
    });

    it('should update user on success', async () => {
      authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.SUPER_ADMIN }));
      vi.mocked(UserService.updateUser).mockResolvedValue({ id: '1' } as unknown as AdminUser);

      const req = new Request('http://localhost:3000/api/users/1', {
        method: 'PATCH',
        body: JSON.stringify({ isActive: false }),
      });
      const response = await PATCH(req, { params: Promise.resolve({ id: '1' }) });

      expect(response.status).toBe(200);
      expect(UserService.updateUser).toHaveBeenCalledWith('1', { isActive: false }, 'admin-1');
    });
  });

  describe('DELETE /api/users/[id]', () => {
    it('should return 403 if not SUPER_ADMIN', async () => {
      authMock.mockResolvedValue(mockSession({ role: Role.EDITOR }));
      const req = new Request('http://localhost:3000/api/users/1', { method: 'DELETE' });
      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(403);
    });

    it('should delete user on success', async () => {
      authMock.mockResolvedValue(mockSession({ id: 'admin-1', role: Role.SUPER_ADMIN }));
      vi.mocked(UserService.deleteUser).mockResolvedValue(true);

      const req = new Request('http://localhost:3000/api/users/1', { method: 'DELETE' });
      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

      expect(response.status).toBe(200);
      expect(UserService.deleteUser).toHaveBeenCalledWith('1', 'admin-1');
    });
  });
});
