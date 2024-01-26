import { createContext, useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEventSource } from "@react-nano/use-event-source";
import { useUser } from "./UserProvider.js";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const endpoint = BASE_API_URL + "/api/connect";

const SSEContext = createContext();

export default function SSEProvider({ children }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [eventSource, eventSourceStatus] = useEventSource(endpoint + `/${user?.id}`, false);
  const [globalEventSource, globalEventSourceStatus] = useEventSource(endpoint, false);

  const onError = useCallback(() => {
    if (user) {
      showNotification({
        title: t("server-error"),
        message: "Error connecting to the server sent events",
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 8000,
      });
    }
  }, [t]);

  useEffect(() => {
    console.log("User SSE status changed to:", eventSourceStatus);
    if (eventSourceStatus === "error") {
      onError();
    }
  }, [eventSourceStatus]);

  useEffect(() => {
    console.log("Global SSE status changed to:", globalEventSourceStatus);
    if (globalEventSourceStatus === "error") {
      onError();
    }
  }, [globalEventSourceStatus]);

  return (
    <SSEContext.Provider
      value={{ eventSource, eventSourceStatus, globalEventSource, globalEventSourceStatus }}
    >
      {children}
    </SSEContext.Provider>
  );
}

export function useSSE() {
  return useContext(SSEContext);
}
