export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });

export { handler as GET, handler as POST };
