import { createStatusChannel } from "./create-status-channel";

export const ANTHROPIC_CHANNEL_NAME = "anthropic-channel";

export const anthropicChannels = createStatusChannel(ANTHROPIC_CHANNEL_NAME);
