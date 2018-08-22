"use babel";

import { Middleware } from "../lib/kernel-middleware";

import { executeResultMessage } from "./helpers";

describe("Middleware", () => {
  let next, code, onResults, middleware;
  beforeEach(() => {
    next = jasmine.createSpyObj("next", ["execute"]);
    code = 'print("Stuck in the middle with you!")';
    onResults = jasmine.createSpy("onResults");

    middleware = new Middleware();
    middleware.execute(next, code, onResults);
    return;
  });

  it("should call execute once", () => {
    expect(next.execute.calls.count()).toEqual(1);
  });

  it("should continue the execution chain", () => {
    const args = next.execute.calls.argsFor(0);

    expect(args[0]).toBe(code);

    // set up and call the callback
    const cb = args[1];
    executeResultMessage.code = code;
    executeResultMessage.data = {
      "text/plain": "Stuck in the middle with you!"
    };
    const channel = "iopub";

    cb(executeResultMessage, channel);
    expect(onResults).toHaveBeenCalledWith(executeResultMessage, channel);
  });
});
