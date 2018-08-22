/* @flow */

import * as React from "react";
import * as ReactDOM from "react-dom";
import DataResourceTransform from "@nteract/transform-dataresource";
import { CompositeDisposable, Disposable } from "atom";

import { DATA_EXPLORER_MEDIA_TYPE, DATA_EXPLORER_URI } from "./common";

import type { DataResourceBundle } from "./common";

export default class DataExplorerView {
  element: HTMLElement;
  subscriptions: atom$CompositeDisposable;

  constructor(data: DataResourceBundle) {
    this.subscriptions = new CompositeDisposable();
    this.element = document.createElement("div");
    this.element.classList.add("hydrogen", "data-explorer-container");

    const disposeElement: atom$Disposable = new Disposable(() => {
      ReactDOM.unmountComponentAtNode(this.element);
    });

    this.subscriptions.add(disposeElement);

    ReactDOM.render(<DataResourceTransform data={data} />, this.element);
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
}
