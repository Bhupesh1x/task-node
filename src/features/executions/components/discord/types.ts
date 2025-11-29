import type { z } from "zod";
import type { Node } from "@xyflow/react";

import type { formSchema } from "./schema";

export interface DiscordNodeData {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
  [key: string]: unknown;
}

export type DiscordNodeType = Node<DiscordNodeData>;

export type formType = z.infer<typeof formSchema>;
