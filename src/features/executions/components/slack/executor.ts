import ky from "ky";
import Handlebars from "handlebars";

import { decode } from "html-entities";
import { NonRetriableError } from "inngest";

import { slackChannels } from "@/inngest/channels/slack";

import type { NodeExecutor } from "../../types";

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonStringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringfy);
  return safeString;
});

export async function slackExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<SlackData>>[0]) {
  await publish(
    slackChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.content) {
    await publish(
      slackChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("SLACK_ERROR: Message content is required");
  }

  try {
    const contentRaw = Handlebars.compile(data?.content)(context);
    const content = decode(contentRaw);

    const result = await step.run("send-slack-message", async () => {
      if (!data?.variableName) {
        await publish(
          slackChannels().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("SLACK_ERROR: Variable name is required");
      }

      if (!data?.webhookUrl) {
        await publish(
          slackChannels().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError(
          "SLACK_ERROR: Slack Webhook URL is required"
        );
      }

      await ky.post(data.webhookUrl, {
        json: {
          content,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          message: content?.slice(0, 2000),
        },
      };
    });

    await publish(
      slackChannels().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      slackChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
}
