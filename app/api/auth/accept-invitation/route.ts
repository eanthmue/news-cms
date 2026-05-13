import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/services/auth-service";
import { z } from "zod";

const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, name } = acceptInvitationSchema.parse(body);

    await AuthService.acceptInvitation(token, password, name);

    return NextResponse.json({ message: "Invitation accepted successfully. You can now log in." });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
