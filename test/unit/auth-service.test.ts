import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/features/auth/services/auth-service';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createAuditLog } from '@/lib/audit-log';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminUser: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock('@/lib/audit-log', () => ({
  createAuditLog: vi.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('should return null if user is not found', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);

      const result = await AuthService.validateCredentials('test@example.com', 'password');

      expect(result).toBeNull();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN_FAILURE',
        metadata: expect.objectContaining({ reason: 'User not found' }),
      }));
    });

    it('should throw error if account is inactive', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: false,
      } as any);

      await expect(AuthService.validateCredentials('test@example.com', 'password'))
        .rejects.toThrow('Invalid credentials or account issue.');

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN_FAILURE',
        metadata: expect.objectContaining({ reason: 'Account inactive' }),
      }));
    });

    it('should throw error if account is locked out', async () => {
      const futureDate = new Date(Date.now() + 10000);
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: true,
        lockoutUntil: futureDate,
      } as any);

      await expect(AuthService.validateCredentials('test@example.com', 'password'))
        .rejects.toThrow('Invalid credentials or account issue.');

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN_FAILURE',
        metadata: expect.objectContaining({ reason: 'Account locked out' }),
      }));
    });

    it('should increment failed attempts and lockout if password is invalid', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: true,
        password: 'hashed_password',
        failedLoginAttempts: 4,
        lockoutUntil: null,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await expect(AuthService.validateCredentials('test@example.com', 'wrong_password'))
        .rejects.toThrow('Invalid credentials or account issue.');

      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          failedLoginAttempts: 5,
          lockoutUntil: expect.any(Date),
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN_FAILURE',
        metadata: expect.objectContaining({ reason: 'Invalid password', failedAttempts: 5 }),
      }));
    });

    it('should return user info on successful login', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        password: 'hashed_password',
        failedLoginAttempts: 0,
        lockoutUntil: null,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await AuthService.validateCredentials('test@example.com', 'correct_password');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
      });

      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          failedLoginAttempts: 0,
          lockoutUntil: null,
          lastLoginAt: expect.any(Date),
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN_SUCCESS',
        userId: '1',
      }));
    });
  });

  describe('generateInvitationToken', () => {
    it('should generate a token and update user', async () => {
      vi.mocked(prisma.adminUser.update).mockResolvedValue({ id: '1' } as any);

      const token = await AuthService.generateInvitationToken('test@example.com', 'admin-1');

      expect(token).toBeDefined();
      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { email: 'test@example.com' },
        data: expect.objectContaining({
          invitationToken: expect.any(String),
          invitationExpiresAt: expect.any(Date),
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'INVITATION_SENT',
        entityId: '1',
        userId: 'admin-1',
      }));
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should return null if user not found', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue(null);

      const token = await AuthService.generatePasswordResetToken('test@example.com');

      expect(token).toBeNull();
    });

    it('should generate a token and update user', async () => {
      vi.mocked(prisma.adminUser.findUnique).mockResolvedValue({ id: '1', email: 'test@example.com' } as any);
      vi.mocked(prisma.adminUser.update).mockResolvedValue({ id: '1' } as any);

      const token = await AuthService.generatePasswordResetToken('test@example.com');

      expect(token).toBeDefined();
      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          resetToken: expect.any(String),
          resetExpiresAt: expect.any(Date),
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'PASSWORD_RESET_REQUESTED',
        entityId: '1',
      }));
    });
  });

  describe('resetPassword', () => {
    it('should throw error if token is invalid or expired', async () => {
      vi.mocked(prisma.adminUser.findFirst).mockResolvedValue(null);

      await expect(AuthService.resetPassword('invalid-token', 'new-password'))
        .rejects.toThrow('Invalid or expired reset token.');
    });

    it('should update password and clear reset token', async () => {
      vi.mocked(prisma.adminUser.findFirst).mockResolvedValue({ id: '1' } as any);
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password');

      await AuthService.resetPassword('valid-token', 'new-password');

      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          password: 'new-hashed-password',
          resetToken: null,
          resetExpiresAt: null,
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'PASSWORD_RESET_SUCCESS',
        entityId: '1',
      }));
    });
  });

  describe('acceptInvitation', () => {
    it('should throw error if token is invalid or expired', async () => {
      vi.mocked(prisma.adminUser.findFirst).mockResolvedValue(null);

      await expect(AuthService.acceptInvitation('invalid-token', 'password', 'New User'))
        .rejects.toThrow('Invalid or expired invitation token.');
    });

    it('should update user and activate account', async () => {
      vi.mocked(prisma.adminUser.findFirst).mockResolvedValue({ id: '1' } as any);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password');

      await AuthService.acceptInvitation('valid-token', 'password', 'New User');

      expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          password: 'hashed-password',
          name: 'New User',
          isActive: true,
          invitationToken: null,
          invitationExpiresAt: null,
        }),
      }));

      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'INVITATION_ACCEPTED',
        entityId: '1',
      }));
    });
  });
});
