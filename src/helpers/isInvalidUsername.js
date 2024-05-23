import isValidEmail from "./isValidEmail";

const validCharacters = /^\w+\S$/;

export default function isInvalidUsername(username) {
  let usernameError;
  console.log("validCharacters.test(username)", validCharacters.test(username));
  if (!username) {
    usernameError = "please-select-a-username";
  } else if (username.length < 3) {
    usernameError = "username-must-be-at-least-3-characters";
  } else if (isValidEmail(username)) {
    usernameError = "username-cannot-be-an-email-address";
  } else if (!validCharacters.test(username)) {
    usernameError = "please-use-only-alphanumeric-characters";
  } else if (username.length > 16) {
    usernameError = "are-you-kidding-me-too-long-username";
  }
  return usernameError;
}
