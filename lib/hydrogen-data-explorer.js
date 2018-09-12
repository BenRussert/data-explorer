/* @flow */

import { CompositeDisposable, Disposable } from "atom";

import { Middleware } from "./kernel-middleware";
import { DATA_EXPLORER_URI } from "./common";
import DataExplorerView from "./data-explorer-view";

/**
 *
 *
 * @date 2018-08-21
 * @class HydrogenDataExplorer
 * Used to create a single atom package instance exported in main
 * only use once, but flow can type classes like this easier than plain objects
 * and also we can create fake instances within specs
 */
export default class HydrogenDataExplorer {
  subscriptions: atom$CompositeDisposable = new CompositeDisposable();
  hydrogen: ?Hydrogen = null;
  middlewareMap: WeakMap<?HydrogenKernel, Middleware> = new WeakMap();
  // This will be the most recent relevant kernel seen (see todos)
  activeKernel: ?HydrogenKernel;

  activate(state: Object = {}): void {
    this.subscriptions.add(
      atom.workspace.addOpener(uri => {
        if (uri !== DATA_EXPLORER_URI) return;
        const data = this.activeMiddleware ? this.activeMiddleware.data : null;
        if (!data) return;
        return new DataExplorerView(data);
      })
    );

    this.subscriptions.add(
      atom.workspace.observeActivePaneItem(item => {
        if (item instanceof DataExplorerView) {
          const data = this.activeMiddleware
            ? this.activeMiddleware.data
            : null;
          item.render(data);
        }
      })
    );
  }

  deactivate() {
    atom.workspace.getPaneItems().forEach(paneItem => {
      if (!paneItem instanceof DataExplorerView) return;
      paneItem.destroy();
    });
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

      // This is a workaround, see the todo comment in this.activeKernel
      this.activeKernel = kernel;

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
  }

  // TODO: Fix this in hydrogen so it doesnt throw if no kernel??
  // get activeKernel(): ?HydrogenKernel {
  //   // if (!this.hydrogen) return;
  //   // return this.hydrogen.getActiveKernel();
  // }

  get activeMiddleware(): ?Middleware {
    const kernel = this.activeKernel;
    if (!kernel) return;
    return this.middlewareMap.get(kernel);
  }
}
