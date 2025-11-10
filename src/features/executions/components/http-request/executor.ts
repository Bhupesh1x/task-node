import type { NodeExecutor } from "../../types";

type HttpRequestData = Record<string, unknown>;

export async function httpRequestExecutor({
  nodeId,
  context,
  step,
}: Parameters<NodeExecutor<HttpRequestData>>[0]) {
  const result = await step.run("http-request", async () => context);

  return result;
}
