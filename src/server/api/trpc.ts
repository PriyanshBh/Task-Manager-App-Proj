import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/server/auth";   // keep your path
import { prisma } from "@/server/db";   // keep your path

type CreateContextOptions = {
  req: Request;
};

export const createTRPCContext = async ({ req }: CreateContextOptions) => {
  // ✅ Better Auth: use the API surface
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return { prisma, session };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protect routes: requires session.user
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id, // convenience
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
