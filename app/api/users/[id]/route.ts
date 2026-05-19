import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { UserService } from "@/features/users/services/user-service";
import { Role } from "@prisma/client";
import { z } from "zod";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    const user = await UserService.updateUser(id, data, session.user.id);
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await UserService.deleteUser(id, session.user.id);
    return NextResponse.json({ message: "User deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    if (message === "User not found.") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
