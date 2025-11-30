import { z } from "zod";

export const formSchema = z.object({
  variableName: z
    .string()
    .trim()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and can contain only letters, numbers and underscore",
    }),
  content: z.string().trim().min(1, "Message content is required"),
  webhookUrl: z.string().trim().min(1, "Webhook url is required"),
});
