import { z } from "zod";

import { db } from "@/lib/db";
import { CredentialType } from "@/generated/prisma";
import { createTRPCRouter, premiumProcedure } from "@/trpc/init";

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
});
