import { useQuery } from "@tanstack/react-query";
import { alphabetical, fork } from "radash";
import { useApi } from "../contexts/ApiProvider.js";

// Get the list of registered quizzers, optionally excluding one user ID
export async function getQuizzers(excludeId) {
  const api = useApi();
  let quizzers = [];
  console.log("Excluding ID:", excludeId);
  const response = await api.get("/users");
  if (response.ok) {
    quizzers = alphabetical(response.data, (item) => item.name);
    if (excludeId) {
      const [, otherQuizzers] = fork(quizzers, (q) => q.id === excludeId);
      quizzers = otherQuizzers;
    }
    return quizzers;
  } else {
    throw new Error("No quizzers found");
  }
}
export default function useQuizzersQuery() {
  return useQuery({
    queryKey: ["quizzers"],
    queryFn: () => getQuizzers(),
  });
}
