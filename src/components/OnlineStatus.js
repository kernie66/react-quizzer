import { useNetwork } from "@mantine/hooks";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useSSE } from "../contexts/SSEProvider.js";
import { useEventSourceListener } from "@react-nano/use-event-source";
import { useState } from "react";

export default function OnlineStatus() {
  const [data, setData] = useState();
  const networkStatus = useNetwork();
  const { eventSource } = useSSE();

  useEventSourceListener(
    eventSource,
    ["ping"],
    (event) => {
      const eventData = JSON.parse(event.data);
      setData(eventData.message);
    },
    [setData],
  );
  return (
    <>
      <div>
        {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}
        {data}
      </div>
    </>
  );
}
