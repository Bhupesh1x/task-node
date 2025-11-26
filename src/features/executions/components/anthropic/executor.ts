import Handlebars from "handlebars";

import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";

import { anthropicChannels } from "@/inngest/channels/anthropic";

import type { NodeExecutor } from "../../types";

type AnthropicData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonStringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringfy);
  return safeString;
});

export async function anthropicExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<AnthropicData>>[0]) {
  await publish(
    anthropicChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.variableName) {
    await publish(
      anthropicChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError(`ANTHROPIC_ERROR: Variable name is required`);
  }

  if (!data?.userPrompt) {
    await publish(
      anthropicChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("ANTHROPIC_ERROR: User prompt is required");
  }

  const systemPrompt = data?.systemPrompt
    ? Handlebars.compile(data?.systemPrompt)(context)
    : "You are an helpful assistant";
  const userPrompt = Handlebars.compile(data?.userPrompt)(context);

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-5-sonnet-latest"),
        system: systemPrompt,
        prompt: userPrompt,
      }
    );

    await publish(
      anthropicChannels().status({
        nodeId,
        status: "success",
      })
    );

    const text =
      steps?.[0]?.content?.[0]?.type === "text"
        ? steps?.[0]?.content?.[0]?.text
        : "";

    return {
      ...context,
      [data?.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      anthropicChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
}
