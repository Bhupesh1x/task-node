"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { discordChannels } from "@/inngest/channels/discord";

export type DiscordChannel = Realtime.Token<typeof discordChannels, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordChannel> {
  const token = await getSubscriptionToken(inngest, {
    channel: discordChannels(),
    topics: ["status"],
  });

  return token;
}
