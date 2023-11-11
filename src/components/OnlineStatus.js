// import { useNetwork } from "@mantine/hooks";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // const networkStatus = useNetwork();

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

  return <div>{isOnline ? <IconWifi color="green" /> : <IconWifiOff color="red" />}</div>;
}

// {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}
