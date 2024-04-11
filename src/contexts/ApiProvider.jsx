import { createContext, useCallback, useContext, useMemo } from "react";
import AxiosApiClient from "../AxiosApiClient";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { rem } from "@mantine/core";
import { TbX } from "react-icons/tb";

const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const { t } = useTranslation();

  const onError = useCallback(() => {
    showNotification({
      title: t("server-error"),
      message: t("an-unexpected-error-occurred-with-the-api-please-try-again"),
      color: "red",
      icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
      // autoClose: 4000,
    });
  }, [t]);

  const api = useMemo(() => new AxiosApiClient(onError), [onError]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
