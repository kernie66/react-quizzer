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
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const mockAxios = new MockAdapter(myAxios, { onNoMatch: "throwException" });
const loginData = { username: "john", password: "VerySimplePassword" };
const loginEmail = "john@doe.com";
const loginUrl = "/login";
const logoutUrl = "/logout";
const checkUrl = "/check";

let store = {};

beforeAll(() => {
  mockAxios.reset();
});

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((key) => {
        return store[key];
      }),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    },
    writable: true,
  });
});

// afterEach(cleanup);

function setup() {
  return userEvent.setup();
}

const renderLoginPage = () => {
  render(
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <FlashProvider>
            <ApiProvider>
              <UserProvider>
                <TestLogoutComponent />
                <LoginPage />
              </UserProvider>
            </ApiProvider>
          </FlashProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>,
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
    const loginResponseData = {
      id: userId,
      username: "john",
      accessToken: "fakeToken",
      refreshToken: "fakeRefreshToken",
    };
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
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);

    // Logout user
    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockAxios.history.delete.length).toBe(1);
    expect(window.localStorage.clear).toHaveBeenCalledTimes(1);
  });

  it("checks for errors when username is missing", async () => {
    const user = setup();

    renderLoginPage();
    const passwordInput = screen.getByText(/^password/);

    await user.type(passwordInput, loginData.password);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^username-or-email-is-missing/)).toBeDefined();
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it("checks for errors when password is missing", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(200);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });

    await user.type(usernameInput, loginData.username);
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^password-is-missing/)).toBeDefined();
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
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
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
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
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it("checks for errors when password is wrong", async () => {
    const user = setup();
    mockAxios.onGet(checkUrl).reply(200);
    mockAxios.onPost(loginUrl).reply(401);
    mockAxios.onPost("/refresh-token").reply(200);

    renderLoginPage();
    const usernameInput = screen.getByRole("textbox", { name: /^username/ });
    const passwordInput = screen.getByText(/^password/);

    await user.type(usernameInput, loginData.username);
    await user.type(passwordInput, "WrongPassword");
    await user.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText(/^invalid-password/)).toBeDefined();
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });
});

describe("<LoginPage snapshot />", () => {
  it("should show login modal", () => {
    const component = renderer.create(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <FlashProvider>
            <ApiProvider>
              <UserProvider>
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              </UserProvider>
            </ApiProvider>
          </FlashProvider>
        </QueryClientProvider>
      </BrowserRouter>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
