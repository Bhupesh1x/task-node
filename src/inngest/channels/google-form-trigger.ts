import { createStatusChannel } from "./create-status-channel";

export const GOOGLE_FROM_TRIGGER_CHANNEL_NAME = "google-form-trigger-channel";

export const googleFormTriggerChannels = createStatusChannel(
  GOOGLE_FROM_TRIGGER_CHANNEL_NAME
);
