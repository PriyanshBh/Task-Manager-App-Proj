import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth);

export const GET = handler;
export const POST = handler;