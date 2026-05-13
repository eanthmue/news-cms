import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createAuditLog } from "@/lib/audit-log";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;
const TOKEN_EXPIRY_HOURS = 24;

export class AuthService {
  static async validateCredentials(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      await createAuditLog({
        action: "LOGIN_FAILURE",
        metadata: { email, reason: "User not found" },
        ipAddress,
        userAgent,
      });
      return null;
    }

    // Check if account is active
    if (!user.isActive) {
      await createAuditLog({
        action: "LOGIN_FAILURE",
        userId: user.id,
        metadata: { reason: "Account inactive" },
        ipAddress,
        userAgent,
      });
      throw new Error("Invalid credentials or account issue.");
    }

    // Check if locked out
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      await createAuditLog({
        action: "LOGIN_FAILURE",
        userId: user.id,
        metadata: { reason: "Account locked out" },
        ipAddress,
        userAgent,
      });
      throw new Error("Invalid credentials or account issue.");
    }

    const isPasswordValid = user.password && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      let lockoutUntil = null;

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }

      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockoutUntil,
        },
      });

      await createAuditLog({
        action: "LOGIN_FAILURE",
        userId: user.id,
        metadata: { reason: "Invalid password", failedAttempts },
        ipAddress,
        userAgent,
      });

      throw new Error("Invalid credentials or account issue.");
    }

    // Success
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
      },
    });

    await createAuditLog({
      action: "LOGIN_SUCCESS",
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  static async generateInvitationToken(email: string, adminId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    const user = await prisma.adminUser.update({
      where: { email },
      data: {
        invitationToken: hashedToken,
        invitationExpiresAt: expiresAt,
      },
    });

    await createAuditLog({
      action: "INVITATION_SENT",
      entity: "AdminUser",
      entityId: user.id,
      userId: adminId,
      metadata: { email },
    });

    return token;
  }

  static async generatePasswordResetToken(email: string) {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return null;

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetExpiresAt: expiresAt,
      },
    });

    await createAuditLog({
      action: "PASSWORD_RESET_REQUESTED",
      entity: "AdminUser",
      entityId: user.id,
      metadata: { email },
    });

    return token;
  }

  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.adminUser.findFirst({
      where: {
        resetToken: hashedToken,
        resetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiresAt: null,
      },
    });

    await createAuditLog({
      action: "PASSWORD_RESET_SUCCESS",
      entity: "AdminUser",
      entityId: user.id,
    });
  }

  static async acceptInvitation(token: string, password: string, name: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.adminUser.findFirst({
      where: {
        invitationToken: hashedToken,
        invitationExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired invitation token.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        name,
        isActive: true,
        invitationToken: null,
        invitationExpiresAt: null,
      },
    });

    await createAuditLog({
      action: "INVITATION_ACCEPTED",
      entity: "AdminUser",
      entityId: user.id,
    });
  }
}
