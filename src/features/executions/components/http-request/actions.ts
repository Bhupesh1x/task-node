"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { httpRequestChannels } from "@/inngest/channels/http-request";

export type HttpRequestChannel = Realtime.Token<
  typeof httpRequestChannels,
  ["status"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannels(),
    topics: ["status"],
  });

  return token;
}
