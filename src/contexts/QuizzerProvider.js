import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "./ApiProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { useLoggedInQuery } from "../hooks/useLoginQuery.js";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery.js";
import { useSetState, useShallowEffect } from "@mantine/hooks";
import queryPersister from "../helpers/queryPersister.js";
import { useEventSourceListener } from "react-sse-hooks"; // "@react-nano/use-event-source";
import { useSSE } from "./SSEProvider.js";

const QuizzerContext = createContext();

export default function QuizzerProvider({ children }) {
  const api = useApi();
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
  const { globalEventSource } = useSSE();
  const [quizzers, setQuizzers] = useSetState({ quizMaster: [], quizzers: [] });
  const [clients, setClients] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const { startListening, stopListening } = useEventSourceListener(
    {
      source: globalEventSource,
      startOnInit: false,
      event: {
        name: "quizzers",
        listener: ({ data }) => {
          console.log("data", data);
          //const parsedData = JSON.parse(data);
          if (data.quizzers) {
            setQuizzers({ quizzers: data.quizzers });
          }
          if (data.quizMaster) {
            setQuizzers({ quizMaster: data.quizMaster });
          }
        },
      },
    },
    [globalEventSource],
  );

  useEffect(() => {
    setClients(quizzers.quizzers.length + quizzers.quizMaster.length);
  }, [quizzers]);

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
          console.log("Logged in quizzer ID:", loggedInId);
          console.log("Start listening for quizzers");
          startListening();
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
