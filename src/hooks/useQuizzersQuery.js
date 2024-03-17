import { useQuery } from "@tanstack/react-query";
import { alphabetical, fork, select } from "radash";
import { useApi } from "../contexts/ApiProvider.js";

const doQuizzersQuery = (select, enabled) => {
  const api = useApi();

  let isEnabled = true; // api.isLoggedIn();
  if (enabled !== undefined) {
    isEnabled = enabled;
  }
  console.log("QuizzersQuery enabled:", isEnabled);

  // Get the list of registered quizzers
  const getQuizzers = async () => {
    console.log("Getting quizzers from server...");
    const response = await api.get("/users");
    if (response.ok) {
      const quizzers = alphabetical(response.data, (item) => item.name);
      return quizzers;
    } else {
      Promise.reject("No quizzers found");
    }
  };

  return useQuery({
    queryKey: ["quizzers"],
    queryFn: () => getQuizzers(),
    select,
    enabled: isEnabled,
    staleTime: Infinity,
  });
};

export const useQuizzersQuery = () => doQuizzersQuery();

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
  console.log("Query quizzer with ID:", includeId);
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
