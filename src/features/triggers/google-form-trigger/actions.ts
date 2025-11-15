"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { googleFormTriggerChannels } from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerChannel = Realtime.Token<
  typeof googleFormTriggerChannels,
  ["status"]
>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannels(),
    topics: ["status"],
  });

  return token;
}
