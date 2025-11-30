import { createStatusChannel } from "./create-status-channel";

export const SLACK_CHANNEL_NAME = "slack-channel";

export const slackChannels = createStatusChannel(SLACK_CHANNEL_NAME);
