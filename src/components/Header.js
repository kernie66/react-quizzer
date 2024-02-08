import { Burger, Group, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useTranslation } from "react-i18next";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { useUser } from "../contexts/UserProvider.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFullscreen, useNetwork, useViewportSize } from "@mantine/hooks";
import { IconMaximize, IconMinimize, IconWifi, IconWifiOff } from "@tabler/icons-react";
import ConnectedUsers from "./ConnectedUsers.js";
import { useSSE } from "../contexts/SSEProvider.js";
import { useEventSourceListener } from "@react-nano/use-event-source";

export default function Header({ opened, toggle }) {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const { height, width } = useViewportSize();
  const networkStatus = useNetwork();
  const { toggle: fullscreenToggle, fullscreen } = useFullscreen();
  const { t } = useTranslation();
  const [clients, setClients] = useState(77);
  const { globalEventSource } = useSSE();

  useEventSourceListener(
    globalEventSource,
    ["clients"],
    ({ data }) => {
      if (data) {
        setClients(data);
      } else {
        setClients(0);
        console.log("No user data from SSE");
      }
    },
    [],
  );

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        setIsAdmin(true);
        console.log("Current user is admin");
      } else {
        setIsAdmin(false);
        console.log("Current user is not admin");
      }
    } else {
      setIsAdmin(false);
      console.log("No current user");
    }
  }, [user]);

  useEffect(() => {
    console.log("Network status:", networkStatus);
  }, [networkStatus]);

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <UnstyledButton component={Link} to="/">
          <Text size="xl" fw={500}>
            {t("app-name")}
          </Text>
        </UnstyledButton>
        <Group ml="xl" gap="xs" visibleFrom="sm">
          {isAdmin && (
            <Stack gap={0} pr={8}>
              <Text size="xs">X: {width}</Text>
              <Text size="xs">Y: {height}</Text>
            </Stack>
          )}
          <ConnectedUsers clients={clients} />
          {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}
          <UserMenu navbar />
        </Group>
      </Group>
      <LanguageSwitcher />
      <UnstyledButton onClick={fullscreenToggle} ml={8}>
        <ThemeIcon
          variant="gradient"
          size={32}
          radius="xl"
          gradient={{ from: "blue", to: "yellow", deg: 320 }}
        >
          {fullscreen ? <IconMinimize size={24} /> : <IconMaximize size={24} />}
        </ThemeIcon>
      </UnstyledButton>
    </Group>
  );
}
