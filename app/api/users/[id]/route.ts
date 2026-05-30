import { auth } from "@/lib/auth";
import { UserService } from "@/features/users/services/user-service";
import { Role } from "@prisma/client";
import { z } from "zod";
import { apiErrors, apiSuccess, apiValidationError } from "@/lib/api/response";

const updateUserSchema = z.object({
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return apiErrors.forbidden();
  }

  try {
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    const user = await UserService.updateUser(id, data, session.user.id);
    return apiSuccess(user);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return apiErrors.internal(message);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return apiErrors.forbidden();
  }

  try {
    await UserService.deleteUser(id, session.user.id);
    return apiSuccess(null);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    if (message === "User not found.") {
      return apiErrors.notFound(message);
    }
    return apiErrors.internal(message);
  }
}
