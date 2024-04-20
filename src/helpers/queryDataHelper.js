import { queryClient } from "../App";

export const getLoggedInUserId = () => {
  const queryState = queryClient.getQueryState(["loggedIn"]);
  console.log(queryState);
  if (queryState?.status === "error") {
    throw new Error("Error getting logged in user");
  }
  return queryClient.getQueryData(["loggedIn"]);
};

export const clearLoggedInUserId = () => {
  queryClient.setQueryData(["loggedIn"], 0);
};
