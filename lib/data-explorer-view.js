/* @flow */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
// $FlowFixMe
import { DataExplorer, Toolbar, Viz } from "@nteract/data-explorer";
import { CompositeDisposable, Disposable } from "atom";

import { DATA_EXPLORER_MEDIA_TYPE, DATA_EXPLORER_URI } from "./common";

import type { DataResource } from "./common";

const GlobalThemeVariables = createGlobalStyle`
:root{
  --nt-color-midnight: hsl(0, 0%, 15%);
  --nt-color-midnight-lightest: hsl(0, 0%, 85%);
  --theme-app-fg: ${props =>
    props.theme === "light"
      ? "var(--nt-color-midnight)"
      : "var(--nt-color-midnight-lightest)"};
  --theme-app-bg: ${props => (props.theme === "light" ? "white" : "#2b2b2b")};
}

.data-explorer-container {
  background-color: var(--theme-app-bg);

  select {
    /* the viz control select buttons */
    color: black;
  }

  .ReactTable .-pagination .-btn {
    color: var(--theme-app-fg);
  }

  div.control-wrapper > button {
    color: black;
  }
}

`;

function DataExplorerCustom({ data }) {
  const [theme, setTheme] = useState(atom.config.get("data-explorer.theme"));

  useEffect(() => {
    const disposer = atom.config.observe("data-explorer.theme", newValue => {
      setTheme(newValue);
    });

    return () => {
      disposer.dispose();
    };
  }, []);

  useEffect(() => {
    atom.config.set("data-explorer.theme", theme);
  }, [theme]);

  const otherTheme = theme === "light" ? "dark" : "light";
  return (
    <React.Fragment>
      <GlobalThemeVariables theme={theme} />
      <label className="input-label" style={{ marginLeft: "10px" }}>
        Dark mode
        <input
          className="input-toggle"
          type="checkbox"
          checked={theme === "dark"}
          onChange={e => {
            const newTheme = e.target.checked ? "dark" : "light";
            setTheme(newTheme);
          }}
          style={{ margin: "10px" }}
        />
      </label>
      <DataExplorer data={data} theme={theme}>
        <Toolbar />
        <Viz />
      </DataExplorer>
    </React.Fragment>
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

  render(data: DataResource | null) {
    if (!data) return;
    ReactDOM.render(<DataExplorerCustom data={data} />, this.element);
  }
}
