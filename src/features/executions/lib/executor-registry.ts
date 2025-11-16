import { NonRetriableError } from "inngest";

import { NodeType } from "@/generated/prisma";

import { manualTriggerExecutor } from "@/features/triggers/manual-triggers/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/google-form-trigger/executor";

import type { NodeExecutor } from "../types";

export const executeRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export function getExecutor(type: NodeType): NodeExecutor {
  const executor = executeRegistry[type];

  if (!executor) {
    throw new NonRetriableError(`No executor found for node type: ${type}`);
  }

  return executor;
}
