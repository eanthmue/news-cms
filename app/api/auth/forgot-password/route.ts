import { AuthService } from "@/features/auth/services/auth-service";
import { z } from "zod";
import { apiErrors, apiSuccess, apiValidationError } from "@/lib/api/response";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const token = await AuthService.generatePasswordResetToken(email);

    // In a real app, send email with token
    if (token) {
      console.log(`Password reset token for ${email}: ${token}`);
    }

    // Always return success to avoid email enumeration
    return apiSuccess({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }
    return apiErrors.internal();
  }
}
