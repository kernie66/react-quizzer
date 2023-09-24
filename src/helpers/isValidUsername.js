import isValidEmail from "./isValidEmail.js";

export default function isValidUsername(username) {
  let usernameError;
  if (!username) {
    usernameError = "please-select-a-username";
  } else if (username.length < 3) {
    usernameError = "username-must-be-at-least-3-characters";
  } else if (isValidEmail(username)) {
    usernameError = "username-cannot-be-an-email-address";
  } else if (username.length > 16) {
    usernameError = "are-you-kidding-me-too-long-username";
  }
  return usernameError;
}
