import { useNetwork } from "@mantine/hooks";
import { TbWifi, TbWifiOff } from "react-icons/tb";
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
    ({ data }) => {
      setPingCount(data);
    },
    [setPingCount],
  );

  return (
    <>
      <div>
        {networkStatus.online ? <TbWifi color="green" /> : <TbWifiOff color="red" />} Ping:{" "}
        {pingCount}
      </div>
    </>
  );
}
