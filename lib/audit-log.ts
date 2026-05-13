import { prisma } from "./prisma";

interface AuditLogOptions {
  action: string;
  entity?: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(options: AuditLogOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        action: options.action,
        entity: options.entity,
        entityId: options.entityId,
        userId: options.userId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: options.metadata,
      },
    });
  } catch (error) {
    console.error("CRITICAL: Failed to create audit log entry:", error);
  }
}
