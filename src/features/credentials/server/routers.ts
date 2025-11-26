import { z } from "zod";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { PAGINATION } from "@/configs/constants";
import { CredentialType } from "@/generated/prisma";

export const credentialsRouters = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().trim().min(1, "Value is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name, type, value } = input;

      return db.credential.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value, // TODO: Add encryption
        },
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Credential id is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      return db.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Credential id is required"),
      })
    )
    .query(({ ctx, input }) => {
      return db.credential.findFirstOrThrow({
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

      const [credentials, totalCount] = await Promise.all([
        db.credential.findMany({
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
        db.credential.count({
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
        items: credentials,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        pageSize,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Credential id is required"),
        name: z.string().trim().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().trim().min(1, "Value is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, type, value } = input;

      return db.credential.update({
        where: { id, userId: ctx.auth.user.id },
        data: {
          name,
          type,
          value, // TODO: Add encryption
        },
      });
    }),
});
