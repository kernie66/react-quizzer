import { createContext, useContext, useEffect, useState } from "react";
import { useSetState } from "@mantine/hooks";
import { useEventSourceListener } from "react-sse-hooks"; // "@react-nano/use-event-source";
import { useSSE } from "./SSEProvider.js";

const QuizzerContext = createContext();

export default function QuizzerProvider({ children }) {
  const { globalEventSource } = useSSE();
  const [quizzers, setQuizzers] = useSetState({ quizMaster: [], quizzers: [] });
  const [clients, setClients] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const { startListening, stopListening } = useEventSourceListener(
    {
      source: globalEventSource,
      startOnInit: true,
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

  return (
    <QuizzerContext.Provider value={{ quizzers, clients }}>{children}</QuizzerContext.Provider>
  );
}

export function useQuizzers() {
  return useContext(QuizzerContext);
}
