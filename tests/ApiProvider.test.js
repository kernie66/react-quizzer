import { cleanup, render, screen } from "@testing-library/react";
import FlashProvider from "../src/contexts/FlashProvider.js";
import ApiProvider from "../src/contexts/ApiProvider.js";
// eslint-disable-next-line
import i18n from "./i18nForTest.js";
import TestAuthComponent from "./components/ApiProvider.test/TestAuthComponent.js";
import TestLoginComponent from "./components/ApiProvider.test/TestLoginComponent.js";
import userEvent from "@testing-library/user-event";
import myAxios from "../src/myAxios.instance.js";
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(myAxios, { onNoMatch: "throwException" });
/*
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(() => console.log("Mocking setItem")),
  clear: jest.fn(),
};
global.localStorage = localStorageMock; // as unknown as Storage;
*/
beforeAll(() => {
  mockAxios.reset();
});

afterEach(cleanup);

function setup() {
  return {
    user: userEvent.setup(),
  };
}

const renderTestAuthComponent = (userId) => {
  render(
    <FlashProvider>
      <ApiProvider>
        <TestAuthComponent userId={userId} />
      </ApiProvider>
    </FlashProvider>,
  );
};

const renderTestLoginComponent = () => {
  render(
    <FlashProvider>
      <ApiProvider>
        <TestLoginComponent />
      </ApiProvider>
    </FlashProvider>,
  );
};

describe("should test the direct methods of the API", () => {
  mockAxios.onPost("/refresh-token").reply(200);

  test("checks that no user is authenticated", () => {
    renderTestAuthComponent();

    expect(screen.getByRole("heading").className).toEqual("");
    expect(screen.getByText(/^No user ID set/)).toBeDefined();
  });

  test("checks that the user is authenticated", async () => {
    const userId = 3;
    renderTestAuthComponent(userId);

    expect(screen.getByRole("heading").className).toEqual(String(userId));
    expect(screen.getByText(/^User ID set to 3/)).toBeDefined();
  });

  test("checks that the authenticated user is removed", async () => {
    const { user } = setup();
    const userId = 5;
    renderTestAuthComponent(userId);

    expect(screen.getByRole("heading").className).toEqual(String(userId));
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("heading").className).toEqual("");
    expect(screen.getByText(/^No user ID set/)).toBeDefined();
  });
});

describe("should test the login and logout server methods of the API", () => {
  let store = {};

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

  test("checks login and logout calls to server", async () => {
    const { user } = setup();
    const responseData = {
      id: 2,
      username: "john",
      accessToken: "fakeToken",
      refreshToken: "fakeRefreshToken",
    };
    mockAxios.onPost("/login").reply(200, responseData);
    mockAxios.onDelete("/logout").reply(200);
    mockAxios.onPost("/refresh-token").reply(200);
    renderTestLoginComponent();

    expect(screen.getByText(/^Not logged in/)).toBeDefined();
    expect(screen.getByRole("heading").className).toEqual("");
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);

    // Click test button to log in
    await user.click(screen.getByRole("button"));
    const loggedIn = await screen.findByText(/^User logged in/);
    expect(loggedIn).toBeDefined();
    expect(screen.getByRole("heading").className).toEqual(String(responseData.id));
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("userData", 2);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("accessToken", "fakeToken");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("refreshToken", "fakeRefreshToken");
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(3);

    // Click test button again to log out
    await user.click(screen.getByRole("button"));
    const loggedOut = await screen.findByText(/^Not logged in/);
    expect(loggedOut).toBeDefined();
    expect(screen.getByRole("heading").className).toEqual("");

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.delete.length).toBe(1);
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(5);
    expect(window.localStorage.clear).toHaveBeenCalledTimes(1);
  });
});
