// import { useNetwork } from "@mantine/hooks";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import useNetworkStatus from "../hooks/useNetworkStatus.js";

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const networkState = useNetworkStatus();
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

  return (
    <>
      <div>{isOnline ? <IconWifi color="green" /> : <IconWifiOff color="red" />}</div>
      <div>{networkState.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}</div>
    </>
  );
}

// {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}
