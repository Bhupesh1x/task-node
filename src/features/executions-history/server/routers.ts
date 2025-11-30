import { z } from "zod";

import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const executionsRouters = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Inngest event id is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const execution = await db.executions.findFirstOrThrow({
        where: {
          inngestEventId: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
        },
      });

      return execution;
    }),
});
