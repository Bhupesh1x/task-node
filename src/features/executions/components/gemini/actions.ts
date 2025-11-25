"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { geminiChannels } from "@/inngest/channels/gemini";

export type GeminiChannel = Realtime.Token<typeof geminiChannels, ["status"]>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: geminiChannels(),
    topics: ["status"],
  });

  return token;
}
