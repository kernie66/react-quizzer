import { createContext, useContext, useEffect, useState } from "react";
/*
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { TbX } from "react-icons/tb";
import { useEventSource } from "@react-nano/use-event-source";
*/
import { useEventSource } from "react-sse-hooks";
import { useShallowEffect } from "@mantine/hooks";
import { useUser } from "./UserProvider.js";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const endpoint = BASE_API_URL + "/api/connect";

const SSEContext = createContext();

export default function SSEProvider({ children }) {
  // const { t } = useTranslation();
  const [url, setUrl] = useState(endpoint);
  const { user } = useUser();

  /*
  const onError = useCallback(() => {
    if (user) {
      showNotification({
        title: t("server-error"),
        message: "Error connecting to the server sent events",
        color: "red",
        icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 8000,
      });
    }
  }, [t]);
*/
  useEffect(() => {
    let newUrl = endpoint;
    if (user) {
      console.log("user.id", user.id);
      newUrl = endpoint + "/" + user.id;
    }
    setUrl(newUrl);
  }, [user]);

  const globalEventSource = useEventSource({
    source: url,
  });

  useShallowEffect(() => {
    console.log("Global SSE status changed to:", globalEventSource.readyState);
    /* if (globalEventSourceStatus === "error") {
      onError();
    } */
  }, [globalEventSource]);

  return <SSEContext.Provider value={{ globalEventSource }}>{children}</SSEContext.Provider>;
}

export function useSSE() {
  return useContext(SSEContext);
}
