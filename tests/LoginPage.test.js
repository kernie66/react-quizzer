import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import LoginPage from "../src/pages/LoginPage.js";
import UserProvider from "../src/contexts/UserProvider.js";
import ApiProvider from "../src/contexts/ApiProvider.js";
import FlashProvider from "../src/contexts/FlashProvider.js";
import { BrowserRouter } from "react-router-dom";
import "./i18nForTest";
import PublicRoute from "../src/components/PublicRoute.js";
import userEvent from "@testing-library/user-event";
import myAxios from "../src/myAxios.instance.js";
import MockAdapter from "axios-mock-adapter";
import TestLogoutComponent from "./components/LoginPage.test/TestLogoutComponent.js";

const mockAxios = new MockAdapter(myAxios, { onNoMatch: "throwException" });
const loginData = { username: "john", password: "VerySimplePassword" };
const loginEmail = "john@doe.com";
const loginUrl = "/login";
const logoutUrl = "/logout";
const checkUrl = "/auth/check";

beforeAll(() => {
  mockAxios.reset();
});

// afterEach(cleanup);

function setup() {
  return userEvent.setup();
}

const renderLoginPage = () => {
  render(
    <BrowserRouter>
      <FlashProvider>
        <ApiProvider>
          <UserProvider>
            <TestLogoutComponent />
            <LoginPage />
          </UserProvider>
        </ApiProvider>
      </FlashProvider>
    </BrowserRouter>,
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
    const userUrl = `/users/${userId}`;
    const loginResponseData = { id: userId, username: "john" };
    const userResponseData = [
      { id: userId, username: "john", name: "John Doe", email: "john@doe.com" },
    ];
    mockAxios.onPost(loginUrl).reply(200, loginResponseData);
    mockAxios.onGet(userUrl).reply(200, userResponseData);
    mockAxios.onDelete(logoutUrl).reply(200);
    mockAxios.onGet(checkUrl).reply(200);

    renderLoginPage();

    expect(screen.getAllByText(/login/)).toBeDefined();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    // Login user
    await user.type(usernameInput, loginData.username);
    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toEqual(loginUrl);
    expect(mockAxios.history.post[0].data).toBe(JSON.stringify(loginData));
    expect(mockAxios.history.get[1].url).toEqual(userUrl);

    // Logout user
    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockAxios.history.delete.length).toBe(1);
  });

  it("checks for errors when username is missing", async () => {
    const user = setup();

    renderLoginPage();
    const passwordInput = screen.getByText(/^password/);

    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^username-or-email-is-missing/)).toBeDefined();
  });

  it("checks for errors when password is missing", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(200);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });

    await user.type(usernameInput, loginData.username);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^password-is-missing/)).toBeDefined();
  });

  it("checks for errors when username is wrong", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(404);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    await user.type(usernameInput, loginData.username);
    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^user-not-found/)).toBeDefined();
  });

  it("checks for errors when email as username is wrong", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(404);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    await user.type(usernameInput, loginEmail);
    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^user-not-found/)).toBeDefined();
  });

  it("checks for errors when password is wrong", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(200);
    mockAxios.onPost(loginUrl).reply(401);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    await user.type(usernameInput, loginData.username);
    await user.type(passwordInput, "WrongPassword");
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^invalid-password/)).toBeDefined();
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
