// @flow

export type Channel = "shell" | "iopub" | "stdin";

// Scraped from @nteract/messaging::whichMessage
declare type MessageType =
  | "clear_output"
  | "comm_info_request"
  | "complete_request"
  | "display_data"
  | "error"
  | "execute_input"
  | "execute_request"
  | "execute_result"
  | "history_request"
  | "input_reply"
  | "input_request"
  | "inspect_request"
  | "is_complete_request"
  | "kernel_info_request"
  | "shutdown_request"
  | "status"
  | "stream"
  | "update_display_data";

declare type JupyterMessageHeader<MT: MessageType> = {
  msg_id: string,
  username: string,
  date: string, // ISO 8601 timestamp
  msg_type: MT, // this could be an enum
  version: string // this could be an enum
};

declare type JupyterMessage<MT: MessageType, C> = {
  header: JupyterMessageHeader<MT>,
  parent_header: JupyterMessageHeader<*> | {},
  metadata: Object,
  content: C,
  buffers?: Array<any> | null
};

declare type ExecuteMessageContent = {
  code: string,
  silent: boolean,
  store_history: boolean,
  user_expressions: Object,
  allow_stdin: boolean,
  stop_on_error: boolean
};

declare type ExecuteRequest = JupyterMessage<
  "execute_request",
  ExecuteMessageContent
>;
