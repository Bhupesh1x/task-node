import { z } from "zod";
import { generateSlug } from "random-word-slugs";

import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const workflowsRouters = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) => {
    return db.workflow.create({
      data: {
        name: generateSlug(4),
        userId: ctx.auth.user.id,
      },
    });
  }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Workflow id is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      return db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Workflow id is required"),
        name: z.string().trim().min(1, "Name is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      return db.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Workflow id is required"),
      })
    )
    .query(({ ctx, input }) => {
      return db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getMany: protectedProcedure.query(({ ctx }) => {
    return db.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
});
