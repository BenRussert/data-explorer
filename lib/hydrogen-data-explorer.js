/* @flow */

import { CompositeDisposable, Disposable } from "atom";

import { Middleware } from "./kernel-middleware";
import { DATA_EXPLORER_URI } from "./common";
import DataExplorerView from "./data-explorer-view";

/**
 *
 *
 * @date 2018-08-21
 * @export
 * @class HydrogenDataExplorer
 * Used to create a single atom package instance exported in main
 * only use once, but flow can type classes like this easier than plain objects
 * and also we can create fake instances within specs
 */
export default class HydrogenDataExplorer {
  subscriptions: atom$CompositeDisposable;
  hydrogen: ?Hydrogen = null;
  middlewareMap: WeakMap<?HydrogenKernel, Middleware> = new WeakMap();

  activate(state: Object = {}): void {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.workspace.addOpener(uri => {
        if (uri !== DATA_EXPLORER_URI) return;

        const kernel = this.activeKernel;
        const middleware = this.middlewareMap.get(kernel);
        if (!middleware || !middleware.data) return;
        const data = middleware.data;

        return new DataExplorerView(data);
      })
    );
  }

  deactivate() {
    if (!this.subscriptions) return;
    this.subscriptions.dispose();
  }

  consumeHydrogen(hydrogen: Hydrogen) {
    this.hydrogen = hydrogen;

    this.hydrogen.onDidChangeKernel(kernel => {
      if (
        !kernel ||
        kernel.language !== "python" ||
        this.middlewareMap.has(kernel)
      )
        return;

      this.attachMiddleware(kernel);
    });

    return new Disposable(() => {
      this.hydrogen = null;
    });
  }

  attachMiddleware(kernel: HydrogenKernel) {
    const middleware = new Middleware();

    kernel.addMiddleware(middleware);
    this.middlewareMap.set(kernel, middleware);

    kernel.onDidDestroy(() => {
      this.middlewareMap.delete(kernel);
    });

    atom.notifications.addSuccess("Successfully added kernel middlware!");
  }

  get activeKernel(): ?HydrogenKernel {
    if (!this.hydrogen) return;
    return this.hydrogen.getActiveKernel();
  }
}
