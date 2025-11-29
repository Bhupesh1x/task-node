import ky from "ky";
import Handlebars from "handlebars";

import { decode } from "html-entities";
import { NonRetriableError } from "inngest";

import { discordChannels } from "@/inngest/channels/discord";

import type { NodeExecutor } from "../../types";

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonStringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringfy);
  return safeString;
});

export async function discordExecutor({
  data,
  nodeId,
  context,
  step,
  publish,
}: Parameters<NodeExecutor<DiscordData>>[0]) {
  await publish(
    discordChannels().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data?.content) {
    await publish(
      discordChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("DISCORD_ERROR: Message content is required");
  }

  try {
    const contentRaw = Handlebars.compile(data?.content)(context);
    const content = decode(contentRaw);

    const username = data?.username
      ? decode(Handlebars.compile(data?.username)(context))
      : undefined;

    const result = await step.run("send-discord-message", async () => {
      if (!data?.variableName) {
        await publish(
          discordChannels().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("DISCORD_ERROR: Variable name is required");
      }

      if (!data?.webhookUrl) {
        await publish(
          discordChannels().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError(
          "DISCORD_ERROR: Discord Webhook URL is required"
        );
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content?.slice(0, 2000), // Discord's max message length
          username,
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
      discordChannels().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      discordChannels().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
}
