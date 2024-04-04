import { useQuery } from "@tanstack/react-query";
import { alphabetical } from "radash";
import { useApi } from "../contexts/ApiProvider.js";

const doGamesQuery = (select, enabled) => {
  const api = useApi();

  let isEnabled = api.isAuthenticated();
  if (enabled !== undefined && isEnabled) {
    isEnabled = enabled;
  }

  // Get the list of games
  const getGames = async () => {
    console.log("Getting games from server...");
    const response = await api.get("/games");
    if (response.ok) {
      const games = alphabetical(response.data, (item) => item.id);
      return games;
    } else {
      Promise.reject("No games found");
    }
  };

  return useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
    select,
    enabled: isEnabled,
    staleTime: Infinity,
  });
};

export const useGamesQuery = () => doGamesQuery();

/*
const excludeQuizzer = (quizzers, excludeId) => {
  let modifiedQuizzers = quizzers;
  if (excludeId) {
    const [, otherQuizzers] = fork(quizzers, (q) => q.id === Number(excludeId));
    modifiedQuizzers = otherQuizzers;
  }
  return modifiedQuizzers;
};
export const useExcludeQuizzerQuery = (excludeId) =>
  doQuizzersQuery((data) => excludeQuizzer(data, excludeId));

export const useGetQuizzerQuery = (includeId) => {
  // console.log("Query quizzer with ID:", includeId);
  const enabled = includeId !== undefined && Number(includeId) > 0;
  return doQuizzersQuery((data) => data.find((q) => q.id === Number(includeId)), enabled);
};

export const useGetQuizzersQuery = (quizzerArray) =>
  doQuizzersQuery((data) =>
    select(
      data,
      (q) => q,
      (q) => quizzerArray.includes(q.id),
    ),
  );
*/
