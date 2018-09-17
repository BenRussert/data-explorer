/* @flow */
import DataResourceTransform from "@nteract/transform-dataresource";

export type MIMETYPE = "application/vnd.dataresource+json";
export const DATA_EXPLORER_MEDIA_TYPE: MIMETYPE =
  "application/vnd.dataresource+json";

(DataResourceTransform.MIMETYPE: MIMETYPE);

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
export async function openOrShowDock(URI: string): Promise<void> {
  let paneContainer = atom.workspace.paneContainerForURI(URI);
  if (!paneContainer) {
    // Open item without activating
    paneContainer = await atom.workspace.open(URI, {
      searchAllPanes: true,
      activatePane: false
    });
  }
  // if container is a dock, show (but dont focus) the dock,
  // if container is workspace center it will already be showing
  if (typeof paneContainer.show == "function") paneContainer.show();
  return;
}
