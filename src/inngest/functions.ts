import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { inngest } from "./client";

const openai = createOpenAI();
const anthropic = createAnthropic();
const google = createGoogleGenerativeAI();

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute.ai" },
  async ({ event, step }) => {
    await step.sleep("Getting the data", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You're a helpful assistant",
        prompt: "What's the color of sky?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You're a helpful assistant",
        prompt: "What's the color of sky?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-20250514"),
        system: "You're a helpful assistant",
        prompt: "What's the color of sky?",
      }
    );

    return {
      geminiSteps,
      anthropicSteps,
      openaiSteps,
    };
  }
);
