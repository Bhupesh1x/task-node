import { z } from "zod";

import { db } from "@/lib/db";
import { PAGINATION } from "@/configs/constants";
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
          id: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return execution;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.defaultPage),
        pageSize: z
          .number()
          .min(PAGINATION.minPageSize)
          .max(PAGINATION.maxPageSize)
          .default(PAGINATION.defaultPageSize),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [executions, totalCount] = await Promise.all([
        db.executions.findMany({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        db.executions.count({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        items: executions,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        pageSize,
      };
    }),
});
