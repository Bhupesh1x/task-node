import { db } from "@/lib/db";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching-video", "5s");

    await step.sleep("transcribing-video", "5s");

    await step.sleep("sending-to-ai", "5s");

    return db.workflow.create({
      data: {
        name: `workflow-from-inngest-${event?.data?.email}`,
      },
    });
  }
);
