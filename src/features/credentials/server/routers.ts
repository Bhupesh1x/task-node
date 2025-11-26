import { z } from "zod";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/lib/db";
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
      return db.workflow.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
});
