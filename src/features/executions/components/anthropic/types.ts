import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface AnthropicNodeData {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  credentialsId?: string;
  [key: string]: unknown;
}

export type AnthropicNodeType = Node<AnthropicNodeData>;

export type formType = z.infer<typeof formSchema>;
