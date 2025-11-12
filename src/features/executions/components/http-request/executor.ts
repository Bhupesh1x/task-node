import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "../../types";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export async function httpRequestExecutor({
  data,
  nodeId,
  context,
  step,
}: Parameters<NodeExecutor<HttpRequestData>>[0]) {
  if (!data?.endpoint) {
    throw new NonRetriableError("HTTP request node: No endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data?.method || "GET";
    const endpoint = data?.endpoint!;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"]?.includes(method)) {
      options.body = data?.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response?.status,
        statusText: response?.statusText,
        data: responseData,
      },
    };
  });

  return result;
}
