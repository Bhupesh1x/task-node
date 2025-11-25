import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface OpenAiNodeData {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  [key: string]: unknown;
}

export type OpenAiNodeType = Node<OpenAiNodeData>;

export type formType = z.infer<typeof formSchema>;
