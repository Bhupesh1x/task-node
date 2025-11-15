import { createStatusChannel } from "./create-status-channel";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-channel";

export const manualTriggerChannels = createStatusChannel(
  MANUAL_TRIGGER_CHANNEL_NAME
);
