import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import { httpRequestChannels } from "@/inngest/channels/http-request";

import type { NodeExecutor } from "../../types";

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonStringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringfy);
  return safeString;
});

export async function httpRequestExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<HttpRequestData>>[0]) {
  await publish(
    httpRequestChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.endpoint?.trim()?.length) {
    await publish(
      httpRequestChannels().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP request node: No endpoint configured");
  }

  if (!data?.variableName?.trim()?.length) {
    await publish(
      httpRequestChannels().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError(
      "HTTP request node: Variable name not configured"
    );
  }

  if (!data?.method?.trim()?.length) {
    await publish(
      httpRequestChannels().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP request node: Method not configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      const method = data?.method;
      const endpoint = Handlebars.compile(data?.endpoint)(context);

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"]?.includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);

        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");

      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const values = {
        httpResponse: {
          status: response?.status,
          statusText: response?.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: values,
      };
    });

    await publish(
      httpRequestChannels().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannels().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
}
