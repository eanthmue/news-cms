"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function AcceptInvitationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Invitation</h1>
        <p className="mt-2 text-zinc-500">Missing invitation token.</p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/accept-invitation", {
        method: "POST",
        body: JSON.stringify({ token, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/login?invited=success");
      } else {
        setError(data.error);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Complete Your Setup</h1>
        <p className="text-zinc-500">Set your name and password to join the team</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" title="Password" className="text-sm font-medium">
            Set Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" title="Confirm Password" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Setting up..." : "Complete Setup"}
        </Button>
      </form>
    </Card>
  );
}

export default function AcceptInvitationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Suspense fallback={<div>Loading...</div>}>
        <AcceptInvitationForm />
      </Suspense>
    </div>
  );
}
