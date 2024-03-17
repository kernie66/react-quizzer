import { createContext, useContext } from "react";
import { useApi } from "./ApiProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useLoggedInQuery } from "../hooks/useLoginQuery.js";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery.js";
import { useSetState, useShallowEffect } from "@mantine/hooks";
import queryPersister from "../helpers/queryPersister.js";
import { useEventSourceListener } from "@react-nano/use-event-source";
import { useSSE } from "./SSEProvider.js";

const QuizzerContext = createContext();

export default function QuizzerProvider({ children }) {
  const api = useApi();
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const { globalEventSource } = useSSE();
  const [quizzers, setQuizzers] = useSetState({ quizMaster: [], quizzers: [] });

  useEventSourceListener(
    globalEventSource,
    ["quizzers"],
    ({ data }) => {
      const parsedData = JSON.parse(data);
      if (parsedData.quizzers) {
        setQuizzers({ quizzers: parsedData.quizzers });
      }
      if (parsedData.quizMaster) {
        setQuizzers({ quizMaster: parsedData.quizMaster });
      }
    },
    [],
  );

  const clients = quizzers.quizzers.length + quizzers.quizMaster.length;

  queryClient.setQueryDefaults(["authData"], {
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
    persister: queryPersister(),
  });

  const updateUserQuery = (userData) => {
    if (userData) {
      console.log("Refresh quizzers query by invalidation");
      queryClient.invalidateQueries({ queryKey: ["quizzers"] });
    }
  };

  const {
    isLoading: isLoadingLoggedIn,
    isError: isErrorLoggedIn,
    data: loggedInId,
  } = useLoggedInQuery();

  const {
    isLoading: isLoadingUser,
    data: user,
    isError: isUserError,
    error,
    // refetch: refreshUser,
  } = useGetQuizzerQuery(loggedInId);

  useShallowEffect(() => {
    //let userId = 0;
    // Check if the user has been logged in
    if (api.isAuthenticated()) {
      // Check if the login is still valid
      try {
        if (loggedInId) {
          console.log("Logged in user ID:", loggedInId);
        } else if (isLoadingLoggedIn) {
          console.log("Loading login info");
        } else if (isErrorLoggedIn) {
          console.error("Error checking logged in user");
        } else {
          console.log("Remove login");
          api.removeLogin();
        }
      } catch (error) {
        console.error("Error checking login:", error);
        showBoundary(error);
      }
    }
  }, [api, loggedInId, isErrorLoggedIn, isLoadingLoggedIn]);

  useShallowEffect(() => {
    console.log("Current user:", user);
    console.log("Is loading user:", isLoadingUser);
    console.log("Is user error:", isUserError);
    if (isUserError) console.log("Error message:", error);
    updateUserQuery(user);
  }, [user, isLoadingUser, isUserError]);

  return (
    <QuizzerContext.Provider value={{ quizzers, clients, user }}>
      {children}
    </QuizzerContext.Provider>
  );
}

export function useQuizzers() {
  return useContext(QuizzerContext);
}
