// src/server/auth/index.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNextJsHandler } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "../db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }), // ✅ use postgresql here
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: { enabled: true },
  session: {
    storeSessionInDatabase: true,
    expiresIn: 60 * 60 * 24 * 30,
  },
});

export const { GET, POST } = toNextJsHandler(auth);

export const getServerSession = async () =>
  auth.api.getSession({ headers: headers() });

export type Session = Awaited<ReturnType<typeof getServerSession>>;
