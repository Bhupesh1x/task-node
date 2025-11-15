import type { NodeExecutor } from "@/features/executions/types";

import { googleFormTriggerChannels } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export async function googleFormTriggerExecutor({
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<GoogleFormTriggerData>>[0]) {
  await publish(
    googleFormTriggerChannels().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("google-form-trigger", async () => context);

  await publish(
    googleFormTriggerChannels().status({
      nodeId,
      status: "success",
    })
  );

  return result;
}
