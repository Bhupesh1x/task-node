import { createStatusChannel } from "./create-status-channel";

export const GEMINI_CHANNEL_NAME = "gemini-channel";

export const geminiChannels = createStatusChannel(GEMINI_CHANNEL_NAME);
