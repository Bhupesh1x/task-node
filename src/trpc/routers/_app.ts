import { db } from "@/lib/db";
import { inngest } from "@/inngest/client";

import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "test@example.com",
      },
    });

    return { success: true, message: "Job queued" };
  }),
  getMany: protectedProcedure.query(async () => {
    const workflows = await db.workflow.findMany({});

    return workflows;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
