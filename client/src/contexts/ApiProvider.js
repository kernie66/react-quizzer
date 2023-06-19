import { createContext, useCallback, useContext, useMemo } from "react";
import { useFlash } from "./FlashProvider";
import AxiosApiClient from "../AxiosApiClient.js";
import { useTranslation } from "react-i18next";

const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const flash = useFlash();
  const { t } = useTranslation();

  const onError = useCallback(() => {
    flash(t("an-unexpected-error-occurred-with-the-api-please-try-again"), "danger");
  }, [flash, t]);

  const api = useMemo(() => new AxiosApiClient(onError), [onError]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
