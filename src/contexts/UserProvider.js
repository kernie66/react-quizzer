import { createContext, useContext, useCallback } from "react";
import { useApi } from "./ApiProvider";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useLoggedInQuery } from "../hooks/useLoginQuery.js";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery.js";
import { useShallowEffect } from "@mantine/hooks";

const UserContext = createContext();

export default function UserProvider({ children }) {
  // const [user, setUser] = useState();
  // const [loggedInId, setLoggedInId] = useState(0);
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

  const { isLoading, isError, data: loggedInId } = useLoggedInQuery();

  const {
    isLoading: isLoadingUser,
    data: user,
    isError: isUserError,
    error,
    // refetch: refreshUser,
  } = useGetQuizzerQuery(loggedInId);

  useShallowEffect(() => {
    //let userId = 0;
    // Check if the user has been logged in
    if (api.isAuthenticated()) {
      // Check if the login is still valid
      try {
        if (loggedInId) {
          console.log("Logged in user ID:", loggedInId);
          //userId = loggedInUser.data.userId;
          //console.log("User ID:", userId);
          // let response2 = await api.get("/users/" + userId);
          // console.log("Current user:", response2.data[0]);
          // userData = response2.ok ? response2.data[0] : null;
          // updateUserQuery(userData);
        } else if (isLoading) {
          console.log("Loading login info");
        } else if (isError) {
          console.error("Error checking logged in user");
        } else {
          console.log("Remove login");
          api.removeLogin();
        }
        // response = await api.checkLoggedIn();
      } catch (error) {
        console.error("Error checking login:", error);
        showBoundary(error);
      }
    }
    //setLoggedInId(userId);
  }, [api, loggedInId, isError, isLoading]);

  useShallowEffect(() => {
    console.log("Current user:", user);
    console.log("Is loading user:", isLoadingUser);
    console.log("Is user error:", isUserError);
    if (isUserError) console.log("Error message:", error);
    updateUserQuery(user);
  }, [user, isLoadingUser, isUserError]);

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
