import { auth } from "@/lib/auth";
import { UserService } from "@/features/users/services/user-service";
import { Role } from "@prisma/client";
import { apiErrors, apiSuccess } from "@/lib/api/response";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return apiErrors.forbidden();
  }

  const { searchParams } = new URL(req.url);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const limitParam = parseInt(searchParams.get("limit") || "10");
  
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;
  
  const search = searchParams.get("search") || undefined;
  const role = (searchParams.get("role") as Role) || undefined;

  try {
    const result = await UserService.listUsers({ page, limit, search, role });
    return apiSuccess(result.users, {
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return apiErrors.internal(message);
  }
}
