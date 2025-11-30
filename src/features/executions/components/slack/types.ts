import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface SlackNodeData {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  [key: string]: unknown;
}

export type SlackNodeType = Node<SlackNodeData>;

export type formType = z.infer<typeof formSchema>;
