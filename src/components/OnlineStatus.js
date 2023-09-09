import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { t } = useTranslation();

  useEffect(() => {
    function onlineHandler() {
      setIsOnline(true);
    }

    function offlineHandler() {
      setIsOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  return (
    <div>
      {isOnline ? (
        <span>{t("you-are-online")}</span>
      ) : (
        <span>{t("you-are-offline-please-check-your-internet-connection")}</span>
      )}
    </div>
  );
}
