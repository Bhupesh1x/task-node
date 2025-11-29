import { createStatusChannel } from "./create-status-channel";

export const DISCORD_CHANNEL_NAME = "discord-channel";

export const discordChannels = createStatusChannel(DISCORD_CHANNEL_NAME);
