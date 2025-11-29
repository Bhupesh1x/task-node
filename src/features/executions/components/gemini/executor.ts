import Handlebars from "handlebars";

import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { db } from "@/lib/db";

import { geminiChannels } from "@/inngest/channels/gemini";

import type { NodeExecutor } from "../../types";

type GeminiData = {
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

export async function geminiExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}: Parameters<NodeExecutor<GeminiData>>[0]) {
  await publish(
    geminiChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.variableName) {
    await publish(
      geminiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("GEMINI_ERROR: Variable name is required");
  }

  if (!data?.userPrompt) {
    await publish(
      geminiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("GEMINI_ERROR: User prompt is required");
  }

  if (!data?.credentialId) {
    await publish(
      geminiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("GEMINI_ERROR: Gemini credential is required");
  }

  const credential = await step.run("get-credential", async () => {
    return await db.credential.findUnique({
      where: { id: data?.credentialId, userId },
    });
  });

  if (!credential?.id) {
    await publish(
      geminiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("GEMINI_ERROR: Gemini credential not found");
  }

  const systemPrompt = data?.systemPrompt
    ? Handlebars.compile(data?.systemPrompt)(context)
    : "You are an helpful assistant";
  const userPrompt = Handlebars.compile(data?.userPrompt)(context);

  const google = createGoogleGenerativeAI({
    apiKey: credential?.value,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    await publish(
      geminiChannels().status({
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
      geminiChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
}
