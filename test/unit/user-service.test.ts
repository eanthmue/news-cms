import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/features/users/services/user-service';
import { prisma } from '@/lib/prisma';
import { Role, AdminUser } from '@prisma/client';
import { createAuditLog } from '@/lib/audit-log';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminUser: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/audit-log', () => ({
  createAuditLog: vi.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of users and total count', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User One', role: Role.EDITOR, isActive: true },
        { id: '2', email: 'user2@example.com', name: 'User Two', role: Role.SUPER_ADMIN, isActive: true },
      ];
      vi.mocked(prisma.adminUser.findMany).mockResolvedValue(mockUsers as unknown as AdminUser[]);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(2);

      const result = await UserService.listUsers({ page: 1, limit: 10 });

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
      expect(prisma.adminUser.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }));
    });

    it('should apply search filter', async () => {
      vi.mocked(prisma.adminUser.findMany).mockResolvedValue([]);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(0);

      await UserService.listUsers({ search: 'test' });

      expect(prisma.adminUser.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { email: { contains: 'test', mode: 'insensitive' } },
          ],
        }),
      }));
    });

    it('should apply role filter', async () => {
      vi.mocked(prisma.adminUser.findMany).mockResolvedValue([]);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(0);

      await UserService.listUsers({ role: Role.SUPER_ADMIN });

      expect(prisma.adminUser.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          role: Role.SUPER_ADMIN,
        }),
      }));
    });
  });

  describe('updateUser', () => {
    it('should update user and create audit log', async () => {
      const mockUser = { id: '1', email: 'user1@example.com' };
      vi.mocked(prisma.adminUser.update).mockResolvedValue(mockUser as unknown as AdminUser);

      const result = await UserService.updateUser('1', { isActive: false }, 'admin-1');

      expect(result).toEqual(mockUser);
      expect(prisma.adminUser.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'USER_UPDATED',
        entityId: '1',
        userId: 'admin-1',
      }));
    });

    it('should throw error if trying to remove own SUPER_ADMIN role', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: 'admin-1', role: Role.SUPER_ADMIN } as unknown as AdminUser);

      await expect(UserService.updateUser('admin-1', { role: Role.EDITOR }, 'admin-1'))
        .rejects.toThrow('You cannot remove your own SUPER_ADMIN role.');
    });

    it('should throw error if trying to demote the last active SUPER_ADMIN', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: '2', role: Role.SUPER_ADMIN, isActive: true } as unknown as AdminUser);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(1);

      await expect(UserService.updateUser('2', { role: Role.EDITOR }, 'admin-1'))
        .rejects.toThrow('Cannot demote or deactivate the last active SUPER_ADMIN.');
    });

    it('should throw error if trying to deactivate the last active SUPER_ADMIN', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: '2', role: Role.SUPER_ADMIN, isActive: true } as unknown as AdminUser);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(1);

      await expect(UserService.updateUser('2', { isActive: false }, 'admin-1'))
        .rejects.toThrow('Cannot demote or deactivate the last active SUPER_ADMIN.');
    });
  });

  describe('deleteUser', () => {
    it('should throw error if trying to delete own account', async () => {
      await expect(UserService.deleteUser('admin-1', 'admin-1'))
        .rejects.toThrow('You cannot delete your own account.');
    });

    it('should throw error if user not found', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);

      await expect(UserService.deleteUser('non-existent', 'admin-1'))
        .rejects.toThrow('User not found.');
    });

    it('should throw error if trying to delete the last active SUPER_ADMIN', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: '2', role: Role.SUPER_ADMIN, isActive: true } as unknown as AdminUser);
      vi.mocked(prisma.adminUser.count).mockResolvedValue(1);

      await expect(UserService.deleteUser('2', 'admin-1'))
        .rejects.toThrow('Cannot delete the last active SUPER_ADMIN.');
    });

    it('should delete user and create audit log', async () => {
      const mockUser = { id: '2', email: 'user2@example.com' };
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(mockUser as unknown as AdminUser);

      const result = await UserService.deleteUser('2', 'admin-1');

      expect(result).toBe(true);
      expect(prisma.adminUser.delete).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'USER_DELETED',
        entityId: '2',
        userId: 'admin-1',
        metadata: { email: 'user2@example.com' },
      }));
    });
  });
});
