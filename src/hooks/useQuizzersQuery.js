import { useQuery } from "@tanstack/react-query";
import { alphabetical, fork, select } from "radash";
import { useApi } from "../contexts/ApiProvider";

export const useQuizzersQuery = (select, enabled) => {
  const api = useApi();

  let isEnabled = api.isAuthenticated();
  if (enabled !== undefined && isEnabled) {
    isEnabled = enabled;
  }
  // console.log("QuizzersQuery enabled:", isEnabled);

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

// export const useQuizzersQuery = () => doQuizzersQuery();

const excludeQuizzer = (quizzers, excludeId) => {
  let modifiedQuizzers = quizzers;
  if (excludeId) {
    const [, otherQuizzers] = fork(quizzers, (q) => q.id === Number(excludeId));
    modifiedQuizzers = otherQuizzers;
  }
  return modifiedQuizzers;
};

export const useExcludeQuizzerQuery = (excludeId) =>
  useQuizzersQuery((data) => excludeQuizzer(data, excludeId));

export const useGetQuizzerQuery = (includeId) => {
  // console.log("Query quizzer with ID:", includeId);
  const enabled = includeId !== undefined && Number(includeId) > 0;
  return useQuizzersQuery((data) => data.find((q) => q.id === Number(includeId)), enabled);
};

export const useGetQuizzersQuery = (quizzerArray) =>
  useQuizzersQuery((data) =>
    select(
      data,
      (q) => q,
      (q) => quizzerArray.includes(q.id),
    ),
  );
