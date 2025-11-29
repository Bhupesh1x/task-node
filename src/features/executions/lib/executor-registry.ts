import { NonRetriableError } from "inngest";

import { NodeType } from "@/generated/prisma";

import { stripeTriggerExecutor } from "@/features/triggers/stripe-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/manual-triggers/executor";
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/google-form-trigger/executor";

import type { NodeExecutor } from "../types";

import { geminiExecutor } from "../components/gemini/executor";
import { openaiExecutor } from "../components/openai/executor";
import { discordExecutor } from "../components/discord/executor";
import { anthropicExecutor } from "../components/anthropic/executor";

export const executeRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openaiExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export function getExecutor(type: NodeType): NodeExecutor {
  const executor = executeRegistry[type];

  if (!executor) {
    throw new NonRetriableError(`No executor found for node type: ${type}`);
  }

  return executor;
}
