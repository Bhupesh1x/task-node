import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export async function manualTriggerExecutor({
  nodeId,
  context,
  step,
}: Parameters<NodeExecutor<ManualTriggerData>>[0]) {
  const result = await step.run("manual-trigger", async () => context);

  return result;
}
