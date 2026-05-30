import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/features/auth/services/auth-service";
import { Role } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { apiErrors, apiSuccess, apiValidationError } from "@/lib/api/response";

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.nativeEnum(Role).default(Role.EDITOR),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return apiErrors.forbidden();
  }

  try {
    const body = await req.json();
    const { email, name, role } = inviteSchema.parse(body);

    const existingUser = await prisma.adminUser.findUnique({ where: { email } });
    if (existingUser) {
      return apiErrors.conflict("User with this email already exists.");
    }

    // Create user in inactive state
    await prisma.adminUser.create({
      data: {
        email,
        name,
        role,
        password: crypto.randomBytes(32).toString("hex"), // Temporary random password
        isActive: false,
      },
    });

    const token = await AuthService.generateInvitationToken(email, session.user.id);

    // In a real app, send email with token
    if (process.env.NODE_ENV === "development") {
      console.log(`Invitation token for ${email}: ${token}`);
    }

    return apiSuccess({ message: "Invitation sent successfully." }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return apiErrors.internal(message);
  }
}
