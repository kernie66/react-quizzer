import { useQueryClient } from "@tanstack/react-query";

export const getLoggedInUserId = () => {
  const queryClient = useQueryClient();
  let userId;

  const loggedInData = queryClient.getQueryData(["loggedIn"]);
  if (loggedInData) {
    userId = loggedInData.data.userId;
  }
  return userId;
};
