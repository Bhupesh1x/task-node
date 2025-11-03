import { z } from "zod";
import { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { NodeType } from "@/generated/prisma";
import { PAGINATION } from "@/configs/constants";

export const workflowsRouters = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) => {
    return db.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            name: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            type: NodeType.INITIAL,
          },
        },
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
    .query(async ({ ctx, input }) => {
      const workflow = await db.workflow.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      const nodes: Node[] = workflow?.nodes?.map((node) => ({
        data: (node?.data as Record<string, unknown>) || {},
        id: node.id,
        position: node?.position as { x: number; y: number },
        type: node?.type,
      }));

      const edges: Edge[] = workflow?.connections?.map((edge) => ({
        id: edge.id,
        source: edge.fromNodeId,
        target: edge.toNodeId,
        sourceHandle: edge.fromOutput,
        targetHandle: edge.toOutput,
      }));

      return {
        id: workflow?.id,
        name: workflow?.name,
        nodes,
        edges,
      };
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
