import { useQueryClient } from "@tanstack/react-query";

export const getLoggedInUserId = () => {
  const queryClient = useQueryClient();

  const queryState = queryClient.getQueryState(["loggedIn"]);
  console.log(queryState);
  if (queryState?.status === "error") {
    throw new Error("Error getting logged in user");
  }
  return queryClient.getQueryData(["loggedIn"]);
};

export const clearLoggedInUserId = () => {
  const queryClient = useQueryClient();

  queryClient.setQueryData(["loggedIn"], 0);
};
