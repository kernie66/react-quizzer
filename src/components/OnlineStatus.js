import { useNetwork } from "@mantine/hooks";
import { TbWifi, TbWifiOff } from "react-icons/tb";
//import { useEventSourceListener } from "@react-nano/use-event-source";
import { useEffect, useState } from "react";
import { useEventSource, useEventSourceListener } from "react-sse-hooks";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const endpoint = BASE_API_URL + "/api/connect";

export default function OnlineStatus() {
  const [pingCount, setPingCount] = useState("-");
  const networkStatus = useNetwork();
  //  const { globalEventSource } = useSSE();
  /*
  useEventSourceListener(
    globalEventSource,
    ["ping"],
    ({ data }) => {
      setPingCount(data);
    },
    [setPingCount],
  );
*/

  const globalEventSource = useEventSource({
    source: endpoint,
  });

  const { startListening, stopListening } = useEventSourceListener({
    source: globalEventSource,
    startOnInit: true,
    event: {
      name: "ping",
      listener: ({ data }) => setPingCount(data),
    },
  });

  useEffect(() => {
    if (startListening) {
      console.log("Start listening");
    }
    if (stopListening) {
      console.log("Stop listening");
    }
  }, [startListening, stopListening]);

  return (
    <>
      <div>
        {networkStatus.online ? <TbWifi color="green" /> : <TbWifiOff color="red" />} Ping:{" "}
        {pingCount}
      </div>
    </>
  );
}
