import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../src/pages/LoginPage.js";

describe("<LoginPage />", () => {
  it("should render login modal", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/)).toBeInTheDocument();
  });
});
