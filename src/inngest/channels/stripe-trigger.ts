import { createStatusChannel } from "./create-status-channel";

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-channel";

export const stripeTriggerChannels = createStatusChannel(
  STRIPE_TRIGGER_CHANNEL_NAME
);
