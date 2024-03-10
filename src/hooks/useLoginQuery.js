import { useQuery } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import queryPersister from "../helpers/queryPersister.js";

export function useLoggedInQuery(select) {
  const api = useApi();

  // const enabled = api.isLoggedIn();

  // Get the logged in user
  const getLoggedIn = async () => {
    console.log("Get logged in user from server...");
    const response = await api.get("/login");
    if (response.ok) {
      // response.userId = api.getUserId();
      console.log("Check login:", response);
      return response.data.userId;
    } else {
      throw new Error("No logged in user found");
    }
  };

  return useQuery({
    queryKey: ["loggedIn"],
    queryFn: () => getLoggedIn(),
    select,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    // enabled: enabled,
    persister: queryPersister(),
  });
}

export function useLoginQuery(username, password) {
  const api = useApi();

  const login = async () => {
    const response = await api.post("/auth/login", { username, password });
    if (response.ok) {
      console.log("Login response:", response.data);
      return response;
    } else {
      throw new Error("Login failed");
    }
  };

  return useQuery({
    queryKey: ["login"],
    queryFn: () => login(),
    retry: false,
    staleTime: Infinity,
    // enabled: enabled,
    persister: queryPersister(),
  });
}
