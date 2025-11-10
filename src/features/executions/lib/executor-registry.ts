import { NonRetriableError } from "inngest";

import { NodeType } from "@/generated/prisma";

import { manualTriggerExecutor } from "@/features/triggers/manual-triggers/executor";

import type { NodeExecutor } from "../types";

import { httpRequestExecutor } from "../components/http-request/executor";

export const executeRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
};

export function getExecutor(type: NodeType): NodeExecutor {
  const executor = executeRegistry[type];

  if (!executor) {
    throw new NonRetriableError(`No executor found for node type: ${type}`);
  }

  return executor;
}
