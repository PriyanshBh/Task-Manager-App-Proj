// src/app/api/auth/[...all]/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // defer imports to runtime
  const { toNextJsHandler } = await import("better-auth/next-js");
  const { auth } = await import("@/server/auth");
  const h = toNextJsHandler(auth);
  return h.GET(req);
}

export async function POST(req: NextRequest) {
  // defer imports to runtime
  const { toNextJsHandler } = await import("better-auth/next-js");
  const { auth } = await import("@/server/auth");
  const h = toNextJsHandler(auth);
  return h.POST(req);
}
