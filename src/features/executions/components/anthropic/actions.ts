"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { anthropicChannels } from "@/inngest/channels/anthropic";

export type AnthropicChannel = Realtime.Token<
  typeof anthropicChannels,
  ["status"]
>;

export async function fetchAnthropicRealtimeToken(): Promise<AnthropicChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: anthropicChannels(),
    topics: ["status"],
  });

  return token;
}
