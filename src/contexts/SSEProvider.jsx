import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { TbX } from "react-icons/tb";
import { useEventSource, useEventSourceListener } from "react-sse-hooks";
import { useUser } from "./UserProvider";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const endpoint = BASE_API_URL + "/api/connect";

const SSEContext = createContext();

export default function SSEProvider({ children }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(endpoint);
  const { user } = useUser();

  const onError = useCallback(() => {
    if (user) {
      showNotification({
        title: t("server-error"),
        message: t("error-connecting-to-the-server-sent-events"),
        color: "red",
        icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 8000,
      });
    }
  }, [t]);

  useEffect(() => {
    let newUrl = endpoint;
    if (user) {
      console.log("user.id", user.id);
      newUrl = endpoint + "/" + user.id;
      startListening();
    } else {
      stopListening();
      globalEventSource.close();
    }
    setUrl(newUrl);
  }, [user]);

  const globalEventSource = useEventSource({
    source: url,
  });

  // eslint-disable-next-line no-unused-vars
  const { startListening, stopListening } = useEventSourceListener({
    source: globalEventSource,
    startOnInit: false,
    event: {
      name: "error",
      listener: (error) => {
        console.error("Error connecting to global event (SSE):", error);
        onError();
      },
    },
  });

  return <SSEContext.Provider value={{ globalEventSource }}>{children}</SSEContext.Provider>;
}

export function useSSE() {
  return useContext(SSEContext);
}
