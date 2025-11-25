import { createStatusChannel } from "./create-status-channel";

export const OPENAI_CHANNEL_NAME = "openai-channel";

export const openaiChannels = createStatusChannel(OPENAI_CHANNEL_NAME);
