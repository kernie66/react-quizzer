import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useApi } from "./ApiProvider";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let userData = null;

      if (api.isAuthenticated()) {
        let response;
        response = await api.checkLoggedIn();
        if (response.ok) {
          const userId = api.getUserId();
          console.log("User:", userId);
          response = await api.get("/users/" + userId);
          console.log("Current user:", response.data[0]);
          userData = response.ok ? response.data[0] : null;
        } else {
          api.removeLogin();
        }
      }
      setUser(userData);
    })();
  }, [api]);

  const login = useCallback(
    async (username, password) => {
      const result = await api.login(username, password);
      if (result.ok) {
        const userId = result.data.id;
        const response = await api.get("/users/" + userId);
        console.log("Logged in user:", response.data[0]);
        setUser(response.ok ? response.data[0] : null);
        return response;
      }
      return result;
    },
    [api],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    navigate("/login");
  }, [api]);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
