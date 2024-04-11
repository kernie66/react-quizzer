import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  console.log("Private route user:", user);

  if (user === undefined) {
    return null;
  } else if (user) {
    return children;
  } else {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{ next: url }} />;
  }
}
