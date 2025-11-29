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
  credentialId: z.string().trim().min(1, "Anthropic credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().trim().min(1, "User Prompt is required"),
});
