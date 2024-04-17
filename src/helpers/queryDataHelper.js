import { useQueryClient } from "@tanstack/react-query";

export const useGetLoggedInUserId = () => {
  const queryClient = useQueryClient();

  const queryState = queryClient.getQueryState(["loggedIn"]);
  console.log(queryState);
  if (queryState?.status === "error") {
    throw new Error("Error getting logged in user");
  }
  return queryClient.getQueryData(["loggedIn"]);
};

export const useClearLoggedInUserId = () => {
  const queryClient = useQueryClient();

  queryClient.setQueryData(["loggedIn"], 0);
};
