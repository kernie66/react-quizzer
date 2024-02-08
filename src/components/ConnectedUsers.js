import { Badge, Group } from "@mantine/core";
import { IconUser, IconUserOff, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ConnectedUsers({ clients }) {
  const [userIcon, setUserIcon] = useState(<IconUserOff color="red" />);

  useEffect(() => {
    let newIcon = <IconUserOff color="red" />;
    if (clients) {
      if (clients === 1) {
        newIcon = <IconUser color="green" />;
      } else {
        newIcon = <IconUsers color="green" />;
      }
    }
    setUserIcon(newIcon);
  }, [clients]);

  return (
    <Group gap={4}>
      {userIcon}
      <Badge size="lg" circle>
        {clients}
      </Badge>
    </Group>
  );
}
