// src/app/api/auth/[...betterAuth]/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // required for Prisma/BetterAuth on Vercel

import { GET, POST } from "@/server/auth";

// ✅ Safe re-export — Next.js won’t pre-render this because it's marked dynamic
export { GET, POST };
