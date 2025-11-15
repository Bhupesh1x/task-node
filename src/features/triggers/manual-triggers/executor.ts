import type { NodeExecutor } from "@/features/executions/types";

import { manualTriggerChannels } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export async function manualTriggerExecutor({
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<ManualTriggerData>>[0]) {
  await publish(
    manualTriggerChannels().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("manual-trigger", async () => context);

  await publish(
    manualTriggerChannels().status({
      nodeId,
      status: "success",
    })
  );

  return result;
}
