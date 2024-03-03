import { useQuery } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";

export default function useLoginQuery(select) {
  const api = useApi();

  // Get the logged in user
  const getLogin = async () => {
    const response = await api.get("/login");
    if (response.ok) {
      response.userId = api.getUserId();
      console.log("Check login:", response);
      return response;
    } else {
      throw new Error("No logged in user found");
    }
  };

  return useQuery({
    queryKey: ["login"],
    queryFn: () => getLogin(),
    select,
    persister: experimental_createPersister({
      storage: window.localStorage,
      maxAge: 1000 * 60 * 60 * 24 * 10,
    }),
  });
}
