"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { stripeTriggerChannels } from "@/inngest/channels/stripe-trigger";

export type StripeTriggerChannel = Realtime.Token<
  typeof stripeTriggerChannels,
  ["status"]
>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: stripeTriggerChannels(),
    topics: ["status"],
  });

  return token;
}
