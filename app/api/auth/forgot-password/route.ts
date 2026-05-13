import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/services/auth-service";
import { z } from "zod";

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
    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
