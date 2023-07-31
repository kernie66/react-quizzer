import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import LoginPage from "../src/pages/LoginPage.js";
import UserProvider from "../src/contexts/UserProvider.js";
import ApiProvider from "../src/contexts/ApiProvider.js";
import FlashProvider from "../src/contexts/FlashProvider.js";
import { BrowserRouter } from "react-router-dom";
import "./i18nForTest";
import PublicRoute from "../src/components/PublicRoute.js";
import { Container } from "reactstrap";
import userEvent from "@testing-library/user-event";
import myAxios from "../src/myAxios.instance.js";
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(myAxios, { onNoMatch: "throwException" });

beforeAll(() => {
  mockAxios.reset();
});

afterEach(cleanup);

function setup() {
  return userEvent.setup();
}

const renderLoginPage = () => {
  render(
    <Container>
      <BrowserRouter>
        <FlashProvider>
          <ApiProvider>
            <UserProvider>
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            </UserProvider>
          </ApiProvider>
        </FlashProvider>
      </BrowserRouter>
    </Container>,
  );
};

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe("<LoginPage />", () => {
  it("checks that login modal is rendered", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: /^login/ })).toBeDefined();
    expect(screen.getByRole("heading", { name: /^login/ }).className).toBe("modal-title");
    expect(screen.getByRole("button", { name: /^login/ })).toBeDefined();
    expect(screen.getByRole("link", { name: /^register-here/ })).toBeDefined();
    expect(screen.getByRole("link", { name: /^register-here/ })).toHaveAttribute(
      "href",
      "/register",
    );
    expect(screen.getByRole("link", { name: /^new password here/ })).toBeDefined();
    expect(screen.getByRole("link", { name: /^new password here/ })).toHaveAttribute(
      "href",
      "/reset-request",
    );
  });

  it("checks that user John can login", async () => {
    const user = setup();
    const userId = 2;
    const loginUrl = "/auth/login";
    const userUrl = `/users/${userId}`;
    const loginData = { username: "john", password: "VerySimplePassword" };
    const loginResponseData = { id: userId, username: "john" };
    const userResponseData = [
      { id: userId, username: "john", name: "John Doe", email: "john@doe.com" },
    ];
    mockAxios.onPost(loginUrl).reply(200, loginResponseData);
    mockAxios.onGet(userUrl).reply(200, userResponseData);

    renderLoginPage();
    expect(screen.getAllByText(/login/)).toBeDefined();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    await user.type(usernameInput, loginData.username);
    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toEqual(loginUrl);
    expect(mockAxios.history.post[0].data).toBe(JSON.stringify(loginData));
    expect(mockAxios.history.get[0].url).toEqual(userUrl);
  });
});

describe("<LoginPage snapshot />", () => {
  it("should show login modal", () => {
    const component = renderer.create(
      <BrowserRouter>
        <FlashProvider>
          <ApiProvider>
            <UserProvider>
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            </UserProvider>
          </ApiProvider>
        </FlashProvider>
      </BrowserRouter>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
