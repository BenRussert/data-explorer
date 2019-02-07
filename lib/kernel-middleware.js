/* @flow */

import {
  openOrShowDock,
  DATA_EXPLORER_MEDIA_TYPE,
  DATA_EXPLORER_URI
} from "./common";

import type { DataResource } from "./common";

// this is really specific to the results that this middleware will handle
type ExecResultContent = {
  executionCount: number,
  data?: { [key: string]: Object }
};

export class Middleware {
  data: DataResource;

  execute(
    next: HydrogenKernelMiddlewareThunk,
    code: string,
    onResults: HydrogenResultsCallback
  ) {
    next.execute(
      code,
      (
        message: JupyterMessage<MessageType, ExecResultContent>,
        channel: Channel
      ) => {
        if (
          message.header.msg_type === "execute_result" ||
          message.header.msg_type === "display_data"
        ) {
          const { data } = message.content;
          if (data && DATA_EXPLORER_MEDIA_TYPE in data) {
            this.data = data[DATA_EXPLORER_MEDIA_TYPE];
            openOrShowDock(DATA_EXPLORER_URI);
          }
        }
        onResults(message, channel);
      }
    );
  }
}
