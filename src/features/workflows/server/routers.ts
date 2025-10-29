import { z } from "zod";
import { generateSlug } from "random-word-slugs";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { PAGINATION } from "@/configs/constants";

export const workflowsRouters = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) => {
    return db.workflow.create({
      data: {
        name: generateSlug(3),
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
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.defaultPage),
        pageSize: z
          .number()
          .min(PAGINATION.minPageSize)
          .max(PAGINATION.maxPageSize)
          .default(PAGINATION.defaultPageSize),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [workflows, totalCount] = await Promise.all([
        db.workflow.findMany({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        db.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        items: workflows,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        pageSize,
      };
    }),
});
