/* @flow */
export type MIMETYPE = "application/vnd.dataresource+json";
export const DATA_EXPLORER_MEDIA_TYPE: MIMETYPE =
  "application/vnd.dataresource+json";

export const DATA_EXPLORER_URI = "atom://hydrogen-data-explorer/dock-view";

// Just the basics, there is more to fully type this
// https://frictionlessdata.io/specs/tabular-data-resource/
export type DataResource = {
  data: Array<Object | Array<any>>,
  schema: { fields: Array<{ name: string, type: string }> }
};

/**
 * Open a pane container (dock or workspace center) without focusing it
 * @export
 * @param {string} URI
 * @returns {Promise<?atom$PaneContainer>}
 *
 */
export async function openOrShowDock(URI: string): Promise<?void> {
  // atom.workspace.open(URI) will activate/focus the dock by default
  // dock.toggle() or dock.show() will leave focus wherever it was

  // this function is basically workspace.open, except it
  // will not focus the newly opened pane
  let dock = atom.workspace.paneContainerForURI(URI);
  if (dock) {
    // If the target item already exist, activate it and show dock
    const pane = atom.workspace.paneForURI(URI);
    pane && pane.activateItemForURI(URI);
    return dock.show();
  }
}
