"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { openaiChannels } from "@/inngest/channels/openai";

export type OpenAiChannel = Realtime.Token<typeof openaiChannels, ["status"]>;

export async function fetchOpenAiRealtimeToken(): Promise<OpenAiChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: openaiChannels(),
    topics: ["status"],
  });

  return token;
}
