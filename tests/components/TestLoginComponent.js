import { useEffect, useState } from "react";
import { useApi } from "../../src/contexts/ApiProvider.js";
import { Button, Container } from "reactstrap";

export default function TestLoginComponent() {
  const api = useApi();
  const user = { username: "john", password: "doe" };
  const [loggedIn, setLoggedIn] = useState("Not logged in");
  const [userId, setUserId] = useState();
  const [doLogin, setDoLogin] = useState(false);

  function loginUser() {
    console.log("Logging in");
    setDoLogin(true);
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

    if (doLogin) {
      callLogin();
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
