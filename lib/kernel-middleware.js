/* @flow */

import * as _ from "lodash";

import { DATA_EXPLORER_MEDIA_TYPE, DATA_EXPLORER_URI } from "./common";

// this is really specific to this module
type ExecResultContent = {
  executionCount: number,
  data?: { [key: string]: Object }
};

export class Middleware {
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
          }
        }
        onResults(message, channel);
      }
    );
  }
}
