import { useState, useEffect } from "react";
import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";

import type { NodeStatus } from "@/components/nodes/node-status-indicator";

interface Props {
  topic: string;
  nodeId: string;
  channel: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({ nodeId, channel, topic, refreshToken }: Props) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const lastMessage = data
      ?.filter(
        (msg) =>
          msg?.kind === "data" &&
          msg?.channel === channel &&
          msg?.topic === topic &&
          msg?.data?.nodeId === nodeId
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return 0;
      })?.[0];

    if (lastMessage?.kind === "data") {
      setStatus(lastMessage?.data?.status as NodeStatus);
    }
  }, [data, channel, topic, nodeId]);

  return {
    status,
  };
}
