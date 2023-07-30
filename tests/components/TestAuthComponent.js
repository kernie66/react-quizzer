import { useEffect, useState } from "react";
import { useApi } from "../../src/contexts/ApiProvider.js";
import { Button, Container } from "reactstrap";

export default function TestAuthComponent({ userId }) {
  const api = useApi();
  const [hasUser, setHasUser] = useState();
  const [hasUserId, setHasUserId] = useState();

  function removeUser() {
    api.removeUserId();
    setHasUserId(api.getUserId());
  }

  useEffect(() => {
    if (userId) {
      api.setUserId(userId);
      setHasUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    setHasUserId(api.getUserId());
    setHasUser(api.isAuthenticated() ? `User ID set to ${hasUserId}` : "No user ID set");
  }, [hasUserId]);

  return (
    <Container>
      <h1 className={hasUserId}>{hasUser}</h1>
      <Button onClick={removeUser}>Test Button</Button>
    </Container>
  );
}
