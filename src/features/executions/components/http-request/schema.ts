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
  endpoint: z.url({ message: "Must be a valid url" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string(),
});
