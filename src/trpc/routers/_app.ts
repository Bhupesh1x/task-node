import { workflowsRouters } from "@/features/workflows/server/routers";
import { credentialsRouters } from "@/features/credentials/server/routers";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouters,
  credentials: credentialsRouters,
});

// export type definition of API
export type AppRouter = typeof appRouter;
