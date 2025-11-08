import { z } from "zod";

export const formSchema = z.object({
  endpoint: z.url({ message: "Must be a valid url" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string(),
});
