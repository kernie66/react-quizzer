import { useQuery } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import queryPersister from "../helpers/queryPersister.js";

export default function useLoginQuery(select) {
  const api = useApi();

  // const enabled = api.isLoggedIn();

  // Get the logged in user
  const getLogin = async () => {
    console.log("Get logged in user from server...");
    const response = await api.get("/login");
    if (response.ok) {
      // response.userId = api.getUserId();
      console.log("Check login:", response);
      return response;
    } else {
      throw new Error("No logged in user found");
    }
  };

  return useQuery({
    queryKey: ["loggedIn"],
    queryFn: () => getLogin(),
    select,
    retry: false,
    staleTime: Infinity,
    // enabled: enabled,
    persister: queryPersister(),
  });
}
