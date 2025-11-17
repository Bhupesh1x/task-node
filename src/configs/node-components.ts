import type { NodeTypes } from "@xyflow/react";

import { NodeType } from "@/generated/prisma";

import { StripeTriggerNode } from "@/features/triggers/stripe-trigger/Node";
import { ManualTriggerNode } from "@/features/triggers/manual-triggers/Node";
import { HttpRequestNode } from "@/features/executions/components/http-request/Node";
import { GoogleFormTriggerNode } from "@/features/triggers/google-form-trigger/Node";

import { InitialNode } from "@/components/nodes/InitialNode";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
