import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useApi } from "./ApiProvider";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateUserQuery = (userData) => {
    if (userData) {
      queryClient.setQueryData(["user", String(userData.id)], userData);
    }
  };

  useEffect(() => {
    (async () => {
      let userData = null;
      // Check if the user has been logged in
      if (api.isAuthenticated()) {
        let response;
        // Check if the login is still valid
        response = await api.checkLoggedIn();
        if (response.ok) {
          const userId = api.getUserId();
          console.log("User:", userId);
          response = await api.get("/users/" + userId);
          console.log("Current user:", response.data[0]);
          userData = response.ok ? response.data[0] : null;
          updateUserQuery(userData);
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
        const userData = response.ok ? response.data[0] : null;
        updateUserQuery(userData);
        setUser(userData);
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
