import { NonRetriableError } from "inngest";

import { db } from "@/lib/db";
import type { NodeType } from "@/generated/prisma";

import { getExecutor } from "@/features/executions/lib/executor-registry";

import { inngest } from "./client";
import { topologicalSort } from "./utils";

import { geminiChannels } from "./channels/gemini";
import { openaiChannels } from "./channels/openai";
import { anthropicChannels } from "./channels/anthropic";
import { httpRequestChannels } from "./channels/http-request";
import { stripeTriggerChannels } from "./channels/stripe-trigger";
import { manualTriggerChannels } from "./channels/manual-trigger";
import { googleFormTriggerChannels } from "./channels/google-form-trigger";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  {
    event: "workflows/execute.workflow",
    channels: [
      geminiChannels(),
      openaiChannels(),
      anthropicChannels(),
      httpRequestChannels(),
      manualTriggerChannels(),
      stripeTriggerChannels(),
      googleFormTriggerChannels(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event?.data?.workflowId;
    let userId = null;

    if (!workflowId) {
      throw new NonRetriableError("Workflow id is required");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const workflowUserId = await step.run("find-user-id", async () => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });

      return workflow?.userId;
    });

    if (event?.data?.userId) {
      userId = event?.data?.userId;
    } else {
      userId = workflowUserId;
    }

    let context = event?.data?.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);

      context = await executor({
        data: node?.data as Record<string, unknown>,
        nodeId: node?.id,
        context,
        step,
        publish,
        userId,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
