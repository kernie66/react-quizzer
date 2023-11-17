import { createContext, useCallback, useContext, useMemo } from "react";
import AxiosApiClient from "../AxiosApiClient.js";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const { t } = useTranslation();

  const onError = useCallback(() => {
    showNotification({
      title: t("server-error"),
      message: t("an-unexpected-error-occurred-with-the-api-please-try-again"),
      color: "red",
      icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      // autoClose: 4000,
    });
  }, [t]);

  const api = useMemo(() => new AxiosApiClient(onError), [onError]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
