import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import queryPersister from "../helpers/queryPersister.js";

export function useLoggedInQuery(select) {
  const api = useApi();
  const queryClient = useQueryClient();

  // const enabled = api.isLoggedIn();

  // Get the logged in user
  const getLoggedIn = async () => {
    console.log("Get logged in user from server...");
    const response = await api.get("/login");
    console.log("Check login:", response);
    if (response.ok) {
      // response.userId = api.getUserId();
      return response.data.userId;
    } else {
      queryClient.invalidateQueries({ queryKey: ["loggedIn"] });
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

export function setLoginData(response) {
  const queryClient = useQueryClient();

  queryClient.setQueryData(["authData"], response);
}
