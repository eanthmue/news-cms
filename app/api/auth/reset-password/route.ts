import { AuthService } from "@/features/auth/services/auth-service";
import { z } from "zod";
import { apiErrors, apiSuccess, apiValidationError } from "@/lib/api/response";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    await AuthService.resetPassword(token, password);

    return apiSuccess({ message: "Password has been reset successfully." });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return apiErrors.badRequest(message);
  }
}
