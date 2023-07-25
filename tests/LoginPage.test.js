import { render, screen, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import LoginPage from "../src/pages/LoginPage.js";
import UserProvider from "../src/contexts/UserProvider.js";
import FlashProvider from "../src/contexts/FlashProvider.js";
import { BrowserRouter } from "react-router-dom";
import "./i18nForTest";
import PublicRoute from "../src/components/PublicRoute.js";
import { Container } from "reactstrap";
import mockAxios from "jest-mock-axios";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("<LoginPage />", () => {
  it("should render login modal", () => {
    render(
      <Container>
        <BrowserRouter>
          <FlashProvider>
            <UserProvider>
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            </UserProvider>
          </FlashProvider>
        </BrowserRouter>
      </Container>,
    );
    expect(screen.getByText(/log/)).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalled();
  });
});

describe("<LoginPage snapshot />", () => {
  it("should show login modal", () => {
    const component = renderer.create(
      <BrowserRouter>
        <FlashProvider>
          <UserProvider>
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          </UserProvider>
        </FlashProvider>
      </BrowserRouter>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
