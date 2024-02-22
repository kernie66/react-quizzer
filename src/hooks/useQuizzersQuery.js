import { useQuery } from "@tanstack/react-query";
import { alphabetical, fork } from "radash";
import { useApi } from "../contexts/ApiProvider.js";

export default function useQuizzersQuery() {
  const api = useApi();

  // Get the list of registered quizzers
  const getQuizzers = async () => {
    const response = await api.get("/users");
    if (response.ok) {
      const quizzers = alphabetical(response.data, (item) => item.name);
      return quizzers;
    } else {
      throw new Error("No quizzers found");
    }
  };

  return useQuery({
    queryKey: ["quizzers"],
    queryFn: () => getQuizzers(),
  });
}

export const excludeQuizzer = (quizzers, excludeId) => {
  console.log("Excluding ID:", excludeId);
  let modifiedQuizzers = quizzers;
  if (excludeId) {
    const [, otherQuizzers] = fork(quizzers, (q) => q.id === excludeId);
    modifiedQuizzers = otherQuizzers;
  }
  return modifiedQuizzers;
};
