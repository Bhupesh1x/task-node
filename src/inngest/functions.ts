import { NonRetriableError } from "inngest";

import { db } from "@/lib/db";

import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event?.data?.workflowId;

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

    return {
      sortedNodes,
    };
  }
);
