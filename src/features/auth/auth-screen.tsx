"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; // ✅ client SDK

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();

    startTransition(async () => {
      try {
        if (mode === "signup") {
          await authClient.signUp.email({ email, password, name });   // ✅ client call
        } else {
          await authClient.signIn.email({ email, password });          // ✅ client call
        }
        router.refresh(); // cookie is now set in the browser
      } catch (e: any) {
        setError(e?.message ?? "Authentication failed");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        {mode === "signin" ? "Sign in to manage your tasks" : "Create your account"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {mode === "signin"
          ? "Use your credentials to access your personal task dashboard."
          : "Register with your email address to get started."}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Name (optional)</label>
            <Input id="name" name="name" placeholder="Ada Lovelace" autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <Input id="password" name="password" type="password" required autoComplete={mode === "signin" ? "current-password" : "new-password"} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Processing..." : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        type="button"
        className="mt-4 text-sm text-primary underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}
      </button>
    </div>
  );
}
