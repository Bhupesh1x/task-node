import type { NodeTypes } from "@xyflow/react";

import { NodeType } from "@/generated/prisma";

import { OpenAiNode } from "@/features/executions/components/openai/Node";
import { GeminiNode } from "@/features/executions/components/gemini/Node";
import { StripeTriggerNode } from "@/features/triggers/stripe-trigger/Node";
import { ManualTriggerNode } from "@/features/triggers/manual-triggers/Node";
import { AnthropicNode } from "@/features/executions/components/anthropic/Node";
import { HttpRequestNode } from "@/features/executions/components/http-request/Node";
import { GoogleFormTriggerNode } from "@/features/triggers/google-form-trigger/Node";

import { InitialNode } from "@/components/nodes/InitialNode";

export const nodeComponents = {
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.INITIAL]: InitialNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
