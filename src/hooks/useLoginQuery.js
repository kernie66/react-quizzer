import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import queryPersister from "../helpers/queryPersister.js";

export function useLoggedInQuery(select) {
  const api = useApi();
  const queryClient = useQueryClient();

  const enabled = api.isAuthenticated();

  // Get the logged in user
  const getLoggedIn = async () => {
    console.log("Get logged in user from server...");
    const response = await api.get("/login");
    console.log("Check login:", response);
    if (response.ok) {
      // response.userId = api.getUserId();
      return response.data.userId;
    } else if (response.status === 401) {
      queryClient.invalidateQueries({ queryKey: ["loggedIn"] });
      throw new Error("No logged in user found");
    }
  };

  return useQuery({
    queryKey: ["loggedIn"],
    queryFn: () => getLoggedIn(),
    select,
    retry: false,
    staleTime: 60 * 1000,
    gcTime: Infinity,
    enabled: enabled,
    persister: queryPersister(),
  });
}
