/* @flow */

import * as _ from "lodash";

const MEDIA_TYPE_DATA_EXPLORER = "application/vnd.dataresource+json";

export class Middleware {
  execute(
    next: HydrogenKernelMiddlewareThunk,
    code: string,
    onResults: HydrogenResultsCallback
  ) {
    next.execute(
      code,
      (message: JupyterMessage<MessageType, any>, channel: Channel) => {
        if (message.header.msg_type === "execute_result") {
          const { data } = message.content;
          if (data || _.has(data, MEDIA_TYPE_DATA_EXPLORER)) {
            atom.notifications.addSuccess(
              `Just found an ${MEDIA_TYPE_DATA_EXPLORER}`
            );
          }
        }
        onResults(message, channel);
      }
    );
  }
}
