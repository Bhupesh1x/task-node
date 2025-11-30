"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { slackChannels } from "@/inngest/channels/slack";

export type SlackChannel = Realtime.Token<typeof slackChannels, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: slackChannels(),
    topics: ["status"],
  });

  return token;
}
