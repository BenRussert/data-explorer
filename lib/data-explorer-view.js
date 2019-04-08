/* @flow */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataExplorer, Toolbar, Viz } from "@nteract/data-explorer";
import { CompositeDisposable, Disposable } from "atom";

import { DATA_EXPLORER_MEDIA_TYPE, DATA_EXPLORER_URI } from "./common";

import type { DataResource } from "./common";

function DataExplorerCustom({ data }) {
  return (
    <DataExplorer data={data}>
      <Toolbar />
      <Viz />
    </DataExplorer>
  );
}

export default class DataExplorerView {
  element: HTMLElement;
  subscriptions: atom$CompositeDisposable;

  constructor(data: DataResource) {
    this.subscriptions = new CompositeDisposable();
    this.element = document.createElement("div");
    this.element.classList.add("data-explorer-container");
    this.element.classList.add("native-key-bindings");

    this.subscriptions.add(
      new Disposable(() => {
        ReactDOM.unmountComponentAtNode(this.element);
      })
    );

    this.render(data);
  }

  getTitle() {
    return "Data Explorer";
  }

  getDefaultLocation() {
    return "right";
  }

  getAllowedLocations() {
    return ["left", "right", "bottom"];
  }

  getURI() {
    return DATA_EXPLORER_URI;
  }

  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  show() {
    const container = atom.workspace.paneContainerForURI(this.getURI());
    if (!container || !container.show) return;

    container.show();
  }

  render(data?: DataResource) {
    if (!data) return;
    ReactDOM.render(<DataExplorerCustom data={data} />, this.element);
  }
}
