import { createStatusChannel } from "./create-status-channel";

export const HTTP_REQUEST_CHANNEL_NAME = "http-request-channel";

export const httpRequestChannels = createStatusChannel(
  HTTP_REQUEST_CHANNEL_NAME
);
