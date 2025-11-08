import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface HttpRequestNodeData {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
}

export type HttpRequestNodeType = Node<HttpRequestNodeData>;

export type formType = z.infer<typeof formSchema>;
