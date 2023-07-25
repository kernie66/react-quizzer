import isValidEmail from "../src/helpers/isValidEmail.js";

it("should be a valid email", () => {
  const result = isValidEmail("john.doe@example.com");
  expect(result).toBe(true);
});

it("should be too short top domain", () => {
  const result = isValidEmail("john.doe@example.c");
  expect(result).toBe(false);
});

it("should be wrong format", () => {
  const result = isValidEmail("john.doe.example.com");
  expect(result).toBe(false);
});
