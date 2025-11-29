import Handlebars from "handlebars";

import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";

import { db } from "@/lib/db";

import { openaiChannels } from "@/inngest/channels/openai";

import type { NodeExecutor } from "../../types";

type OpenAiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonStringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringfy);
  return safeString;
});

export async function openaiExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<OpenAiData>>[0]) {
  await publish(
    openaiChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.variableName) {
    await publish(
      openaiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OPENAI_ERROR: Variable name is required");
  }

  if (!data?.userPrompt) {
    await publish(
      openaiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OPENAI_ERROR: User prompt is required");
  }

  if (!data?.credentialId) {
    await publish(
      openaiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OPENAI_ERROR: Open Ai credential is required");
  }

  const credential = await step.run("get-credential", async () => {
    return await db.credential.findUnique({
      where: { id: data?.credentialId },
    });
  });

  if (!credential?.id) {
    await publish(
      openaiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OPENAI_ERROR: OpenAI credential not found");
  }

  const systemPrompt = data?.systemPrompt
    ? Handlebars.compile(data?.systemPrompt)(context)
    : "You are an helpful assistant";
  const userPrompt = Handlebars.compile(data?.userPrompt)(context);

  const openAi = createOpenAI({
    apiKey: credential?.value,
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openAi("gpt-4"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    await publish(
      openaiChannels().status({
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
      openaiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
}
