import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import LoginPage from "../pages/LoginPage.js";

describe("<LoginPage />", () => {
  it("should render login modal", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/)).toBeInTheDocument();
  });
});

describe("<LoginPage snapshot />", () => {
  it("should show login modal", () => {
    const component = renderer.create(<LoginPage />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
