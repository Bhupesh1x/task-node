import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface GeminiNodeData {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  [key: string]: unknown;
}

export type GeminiNodeType = Node<GeminiNodeData>;

export type formType = z.infer<typeof formSchema>;
