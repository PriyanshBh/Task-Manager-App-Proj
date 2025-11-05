"use server";

import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

type ActionResult = { success: boolean; error?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!emailRe.test(email)) return { success: false, error: "Enter a valid email" };
  if (password.length < 8) return { success: false, error: "Password must be at least 8 characters" };

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split("@")[0], // ✅ Use email prefix if name is empty
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { 
      success: false, 
      error: error?.body?.message || error?.message || "Signup failed" 
    };
  }
}

export async function signInAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!emailRe.test(email)) return { success: false, error: "Enter a valid email" };
  if (!password) return { success: false, error: "Password is required" };

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { 
      success: false, 
      error: error?.body?.message || error?.message || "Invalid email or password" 
    };
  }
}

export async function signOutAction(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: headers(),
      cookies,
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Sign out error:", error);
  }
}