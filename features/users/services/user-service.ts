import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import { UpdateUserRequest } from "../types";
import { createAuditLog } from "@/lib/audit-log";

export class UserService {
  static async listUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
  }) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.AdminUserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.adminUser.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.adminUser.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  static async updateUser(id: string, data: UpdateUserRequest, adminId: string) {
    // Prevent removing own SUPER_ADMIN role
    if (id === adminId && data.role && data.role !== Role.SUPER_ADMIN) {
      const currentUser = await prisma.adminUser.findUnique({ where: { id } });
      if (currentUser?.role === Role.SUPER_ADMIN) {
        throw new Error("You cannot remove your own SUPER_ADMIN role.");
      }
    }

    // Prevent demoting or deactivating the last active SUPER_ADMIN
    if (data.role === Role.EDITOR || data.isActive === false) {
      const userToUpdate = await prisma.adminUser.findUnique({ where: { id } });
      if (userToUpdate?.role === Role.SUPER_ADMIN && userToUpdate.isActive) {
        const activeSuperAdminCount = await prisma.adminUser.count({
          where: { role: Role.SUPER_ADMIN, isActive: true },
        });
        if (activeSuperAdminCount <= 1) {
          throw new Error("Cannot demote or deactivate the last active SUPER_ADMIN.");
        }
      }
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data,
    });

    await createAuditLog({
      action: "USER_UPDATED",
      entity: "AdminUser",
      entityId: user.id,
      userId: adminId,
      metadata: data as Prisma.InputJsonValue,
    });

    return user;
  }

  static async deleteUser(id: string, adminId: string) {
    // Prevent self-deletion
    if (id === adminId) {
      throw new Error("You cannot delete your own account.");
    }

    // Check if user exists
    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found.");
    }

    // Prevent deleting the last active SUPER_ADMIN
    if (user.role === Role.SUPER_ADMIN && user.isActive) {
      const activeSuperAdminCount = await prisma.adminUser.count({
        where: { role: Role.SUPER_ADMIN, isActive: true },
      });
      if (activeSuperAdminCount <= 1) {
        throw new Error("Cannot delete the last active SUPER_ADMIN.");
      }
    }

    // Delete user
    await prisma.adminUser.delete({
      where: { id },
    });

    await createAuditLog({
      action: "USER_DELETED",
      entity: "AdminUser",
      entityId: id,
      userId: adminId,
      metadata: { email: user.email },
    });

    return true;
  }
}
