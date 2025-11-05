export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
  const { appRouter } = await import("@/server/api/root");
  const { createTRPCContext } = await import("@/server/api/trpc");

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });
}

export async function POST(request: Request) {
  const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
  const { appRouter } = await import("@/server/api/root");
  const { createTRPCContext } = await import("@/server/api/trpc");

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });
}
