import type { NodeTypes } from "@xyflow/react";

import { NodeType } from "@/generated/prisma";

import { ManualTriggerNode } from "@/features/triggers/manual-triggers/Node";
import { HttpRequestNode } from "@/features/executions/components/http-request/Node";

import { InitialNode } from "@/components/nodes/InitialNode";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
