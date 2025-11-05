export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Prisma/BetterAuth need Node runtime on Vercel

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

// Build the Next.js handlers here to avoid eager evaluation issues.
const h = toNextJsHandler(auth);
export const GET = h.GET;
export const POST = h.POST;
