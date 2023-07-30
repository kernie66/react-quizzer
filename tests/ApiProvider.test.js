import { cleanup, render, screen } from "@testing-library/react";
import FlashProvider from "../src/contexts/FlashProvider.js";
import ApiProvider from "../src/contexts/ApiProvider.js";
// eslint-disable-next-line
import i18n from "./i18nForTest.js";
import TestAuthComponent from "./components/TestAuthComponent.js";
import TestLoginComponent from "./components/TestLoginComponent.js";
import userEvent from "@testing-library/user-event";
import myAxios from "../src/myAxios.instance.js";
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(myAxios, { onNoMatch: "throwException" });

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

test("checks that no user is authenticated", () => {
  renderTestAuthComponent();

  expect(screen.getByRole("heading").className).toEqual("");
  expect(screen.getByText(/^No user ID set/)).toBeDefined();
});

test("checks that the user is authenticated", async () => {
  renderTestAuthComponent(3);

  expect(screen.getByRole("heading").className).toEqual("3");
  expect(screen.getByText(/^User ID set to 3/)).toBeDefined();
});

test("checks that the authenticated user is removed", async () => {
  const { user } = setup();
  renderTestAuthComponent(5);

  expect(screen.getByRole("heading").className).toEqual("5");
  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("heading").className).toEqual("");
  expect(screen.getByText(/^No user ID set/)).toBeDefined();
});

test("checks if the user is logged in", async () => {
  const { user } = setup();
  mockAxios.onPost("/auth/login").reply(200, { id: 2, username: "john" });
  renderTestLoginComponent();

  expect(screen.getByText(/^Not logged in/)).toBeDefined();
  expect(screen.getByRole("heading").className).toEqual("");
  await user.click(screen.getByRole("button"));
  expect(mockAxios.history.post.length).toBe(1);

  const loggedIn = await screen.findByText(/^User logged in/);
  expect(loggedIn).toBeDefined();
  expect(screen.getByRole("heading").className).toEqual("2");
});
