import { useQueryClient } from "@tanstack/react-query";

export const getLoggedInUserId = () => {
  const queryClient = useQueryClient();
  let userId;

  const loggedInData = queryClient.getQueryData(["loggedIn"]);
  if (loggedInData) {
    console.log("Logged In Data:", loggedInData);
    userId = loggedInData;
  }
  return userId;
};
