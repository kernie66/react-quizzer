import { useEffect, useState } from "react";
import { useApi } from "../../../src/contexts/ApiProvider.js";
import { Button, Container } from "reactstrap";

const notLoggedInString = "Not logged in";
export default function TestLoginComponent() {
  const api = useApi();
  const user = { username: "john", password: "doe" };
  const [loggedIn, setLoggedIn] = useState(notLoggedInString);
  const [userId, setUserId] = useState();
  const [doLogin, setDoLogin] = useState(false);

  function loginUser() {
    if (loggedIn === notLoggedInString) {
      console.log("Logging in");
      setDoLogin(true);
    } else {
      console.log("Logging out");
      setDoLogin(false);
    }
  }

  useEffect(() => {
    let isActive = true;
    let response;
    async function callLogin() {
      response = await api.login(user.username, user.password);
      if (isActive) {
        if (response.ok) {
          setLoggedIn("User logged in");
        }
      }
    }

    async function callLogout() {
      response = await api.logout();
      if (isActive) {
        if (response.ok) {
          setLoggedIn(notLoggedInString);
        }
      }
    }

    if (doLogin) {
      callLogin();
    } else if (loggedIn !== notLoggedInString) {
      callLogout();
    }

    return () => {
      isActive = false;
    };
  }, [doLogin]);

  useEffect(() => {
    setUserId(api.getUserId());
  }, [loggedIn]);

  return (
    <Container>
      <h1 className={userId}>{loggedIn}</h1>
      <Button onClick={loginUser}>Login</Button>
    </Container>
  );
}
