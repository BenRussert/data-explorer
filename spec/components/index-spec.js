"use babel";

import * as React from "react";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

import { HydrogenDataExplorer } from "../../lib/components";
import { dataExplorerProps } from "../helpers";

describe("The data explorer output component", () => {
  let output = {
    output_type: "display_data",
    data: {
      "text/plain": "Nothing to explore here.",
      "application/vnd.dataresource+json": dataExplorerProps.data
    },
    metadata: {}
  };

  it("Should render without crashing", () => {
    const component = mount(<HydrogenDataExplorer output={output} />);
    expect(component.type()).toEqual(HydrogenDataExplorer);
  });

  it("Should render without crashing", () => {
    output_to_ignore = Object.assign({}, output, {
      data: {
        "text/plain": "Nothing to explore here.",
        "text/something": "Ignore me"
      }
    });
    const component = mount(<HydrogenDataExplorer output={output_to_ignore} />);
    expect(component.html()).toBeNull();
  });
});
