import { useNetwork } from "@mantine/hooks";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useSSE } from "../contexts/SSEProvider.js";
import { useEventSourceListener } from "@react-nano/use-event-source";
import { useState } from "react";

export default function OnlineStatus() {
  const [pingCount, setPingCount] = useState("-");
  const networkStatus = useNetwork();
  const { globalEventSource } = useSSE();

  useEventSourceListener(
    globalEventSource,
    ["ping"],
    (event) => {
      const eventData = JSON.parse(event.data);
      console.log("Event data:", eventData);
      setPingCount(eventData);
    },
    [setPingCount],
  );

  return (
    <>
      <div>
        {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />} Ping:{" "}
        {pingCount}
      </div>
    </>
  );
}
