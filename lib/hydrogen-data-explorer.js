/* @flow */

import { CompositeDisposable, Disposable } from "atom";
import { Middleware } from "./kernel-middleware";

export default class HydrogenDataExplorer {
  subscriptions: atom$CompositeDisposable;
  hydrogen: ?Hydrogen = null;
  middlewareMap: WeakMap<HydrogenKernel, Middleware> = new WeakMap();

  activate(state: Object = {}): void {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add("atom-text-editor", {
        "hydrogen-data-explorer:status": () => this.getStatus()
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

  getStatus(): void {
    if (!this.hydrogen) return;
    atom.notifications.addSuccess("You are connected!");
  }
}
