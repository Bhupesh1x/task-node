import type { NodeExecutor } from "@/features/executions/types";

import { stripeTriggerChannels } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export async function stripeTriggerExecutor({
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<StripeTriggerData>>[0]) {
  await publish(
    stripeTriggerChannels().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("stripe-form-trigger", async () => context);

  await publish(
    stripeTriggerChannels().status({
      nodeId,
      status: "success",
    })
  );

  return result;
}
