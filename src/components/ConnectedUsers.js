import { Badge, Group } from "@mantine/core";
import { useEventSourceListener } from "@react-nano/use-event-source";
import { IconUser, IconUserOff, IconUsers } from "@tabler/icons-react";
import { useSSE } from "../contexts/SSEProvider.js";
import { useState } from "react";

export default function ConnectedUsers() {
  const [clients, setClients] = useState(0);
  const [userIcon, setUserIcon] = useState(<IconUserOff color="red" />);
  const { globalEventSource } = useSSE();

  useEventSourceListener(
    globalEventSource,
    ["ping"],
    (event) => {
      let newIcon;
      const eventData = JSON.parse(event.data);
      if (eventData.clients) {
        setClients(eventData.clients);
        if (eventData.clients === 1) {
          newIcon = <IconUser color="green" />;
        } else {
          newIcon = <IconUsers color="green" />;
        }
      } else {
        setClients(0);
        newIcon = <IconUserOff color="red" />;
      }
      setUserIcon(newIcon);
    },
    [setClients],
  );

  return (
    <Group gap={4}>
      {userIcon}
      <Badge size="lg" circle>
        {clients}
      </Badge>
    </Group>
  );
}
