import { useNetwork } from "@mantine/hooks";
import { TbWifi, TbWifiOff } from "react-icons/tb";
import { useState } from "react";
import { useEventSourceListener } from "react-sse-hooks";
import { useSSE } from "../contexts/SSEProvider";

export default function OnlineStatus() {
  const [pingCount, setPingCount] = useState("-");
  const networkStatus = useNetwork();
  const { globalEventSource } = useSSE();

  // eslint-disable-next-line no-unused-vars
  const { startListening, stopListening } = useEventSourceListener({
    source: globalEventSource,
    startOnInit: true,
    event: {
      name: "ping",
      listener: ({ data }) => setPingCount(data),
    },
  });

  return (
    <>
      <div>
        {networkStatus.online ? <TbWifi color="green" /> : <TbWifiOff color="red" />} Ping:{" "}
        {pingCount}
      </div>
    </>
  );
}
