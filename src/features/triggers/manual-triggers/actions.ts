"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { manualTriggerChannels } from "@/inngest/channels/manual-trigger";

export type ManualTriggerChannel = Realtime.Token<
  typeof manualTriggerChannels,
  ["status"]
>;

export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannels(),
    topics: ["status"],
  });

  return token;
}
