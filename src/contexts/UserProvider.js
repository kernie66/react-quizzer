import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useApi } from "./ApiProvider";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import useLoginQuery from "../hooks/useLoginQuery.js";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery.js";

const UserContext = createContext();

export default function UserProvider({ children }) {
  // const [user, setUser] = useState();
  const [loggedInId, setLoggedInId] = useState(0);
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();

  const updateUserQuery = (userData) => {
    if (userData) {
      console.log("Refresh quizzers query by invalidation");
      // queryClient.setQueryData(["user", String(userData.id)], userData);
      queryClient.invalidateQueries({ queryKey: ["quizzers"] });
    }
  };

  const { isLoading, isError, data: loggedInUser } = useLoginQuery();

  const {
    // isLoading: isLoadingUser,
    data: user,
    // isError: isUserError,
    // refetch: refreshUser,
  } = useGetQuizzerQuery(loggedInId);

  useEffect(() => {
    let userId = 0;
    // Check if the user has been logged in
    if (api.isAuthenticated()) {
      // Check if the login is still valid
      try {
        if (loggedInUser) {
          userId = loggedInUser.data.userId;
          console.log("User ID:", userId);
          // let response2 = await api.get("/users/" + userId);
          // console.log("Current user:", response2.data[0]);
          // userData = response2.ok ? response2.data[0] : null;
          // updateUserQuery(userData);
        } else if (isLoading) {
          console.log("Loading login info");
        } else if (isError) {
          console.error("Error checking logged in user");
        } else {
          api.removeLogin();
        }
        // response = await api.checkLoggedIn();
      } catch (error) {
        console.error("Error checking login:", error);
        showBoundary(error);
      }
    }
    setLoggedInId(userId);
  }, [api, loggedInUser, isError, isLoading]);

  useEffect(() => {
    console.log("Current user:", user);
    updateUserQuery(user);
  }, [user]);

  const login = useCallback(
    async (username, password) => {
      const result = await api.login(username, password);
      if (result.ok) {
        const userId = result.data.id;
        const response = await api.get("/users/" + userId);
        console.log("Logged in user:", response.data[0]);
        const userData = response.ok ? response.data[0] : null;
        updateUserQuery(userData);
        // setUser(userData);
        return response;
      }
      return result;
    },
    [api],
  );

  const logout = useCallback(async () => {
    await api.logout();
    // setUser(null);
    navigate("/login");
  }, [api]);

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
