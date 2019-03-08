"use babel";

import * as React from "react";

import {
  DisplayData,
  ExecuteResult,
  KernelOutputError,
  Output
} from "@nteract/outputs";
import DataExplorer from "@nteract/data-explorer";

import { DATA_EXPLORER_MEDIA_TYPE, DATA_EXPLORER_URI } from "../common";

export function HydrogenDataExplorer({ output }) {
  // Only render display data or execute results
  return (
    <Output output={output}>
      <DisplayData>
        <DataExplorer />
      </DisplayData>
      <ExecuteResult>
        <DataExplorer />
      </ExecuteResult>
      <KernelOutputError />
    </Output>
  );
}
