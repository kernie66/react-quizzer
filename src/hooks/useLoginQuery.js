import { useQuery } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";

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
  });
}
