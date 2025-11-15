import { channel, topic } from "@inngest/realtime";

export function createStatusChannel(channelName: string) {
  return channel(channelName).addTopic(
    topic("status").type<{
      nodeId: string;
      status: "loading" | "success" | "error";
    }>()
  );
}
