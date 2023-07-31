import { Button } from "reactstrap";
import { useUser } from "../../../src/contexts/UserProvider.js";

export default function TestLogoutComponent() {
  const { logout } = useUser();

  return <Button onClick={logout}>Logout</Button>;
}
