/* @flow */

import DataResourceTransform from "@nteract/transform-dataresource";

export type MIMETYPE = "application/vnd.dataresource+json";
export const DATA_EXPLORER_MEDIA_TYPE: MIMETYPE =
  "application/vnd.dataresource+json";

(DataResourceTransform.MIMETYPE: MIMETYPE);

export const DATA_EXPLORER_URI = "atom://hydrogen-data-explorer/dock-view";

export type DataResourceBundle = {
  // Hoe to literal type this using the constant above?
  "application/vnd.dataresource+json": Object
};

export async function openOrShowDock(URI: string): Promise<?void> {
  // atom.workspace.open(URI) will activate/focus the dock by default
  // dock.toggle() or dock.show() will leave focus wherever it was

  // this function is basically workspace.open, except it
  // will not focus the newly opened pane
  let dock = atom.workspace.paneContainerForURI(URI);
  if (dock) return dock.show();

  await atom.workspace.open(URI, {
    searchAllPanes: true,
    activatePane: false
  });
  dock = atom.workspace.paneContainerForURI(URI);
  return dock ? dock.show() : null;
}
