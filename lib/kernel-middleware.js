/* @flow */

import * as _ from "lodash";

export const DATA_EXPLORER = "application/vnd.dataresource+json";

type ExecResultContent = {|
  executionCount: number,
  data?: { [key: string]: Object }
|};

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
          if (data && _.has(data, DATA_EXPLORER)) {
            atom.notifications.addSuccess(`Just found an ${DATA_EXPLORER}`);
          }
        }
        onResults(message, channel);
      }
    );
  }
}
