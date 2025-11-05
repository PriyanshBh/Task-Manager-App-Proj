// src/app/api/auth/[...betterAuth]/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // prevents edge rendering

import { auth } from "@/server/auth";

// do not destructure directly here — re-export manually to avoid eager evaluation
export const GET = auth.GET;
export const POST = auth.POST;
