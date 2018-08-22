/* @flow */

import * as _ from "lodash";

import {
  openOrShowDock,
  DATA_EXPLORER_MEDIA_TYPE,
  DATA_EXPLORER_URI
} from "./common";

import type { DataResourceBundle } from "./common";

// this is really specific to the results that this middleware will handle
type ExecResultContent = {
  executionCount: number,
  data?: { [key: string]: Object }
};

export class Middleware {
  data: DataResourceBundle;

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
        if (message.header.msg_type === "execute_result") {
          const { data } = message.content;
          if (data && _.has(data, DATA_EXPLORER_MEDIA_TYPE)) {
            this.data = data[DATA_EXPLORER_MEDIA_TYPE];
            openOrShowDock(DATA_EXPLORER_URI);
          }
        }
        onResults(message, channel);
      }
    );
  }
}
