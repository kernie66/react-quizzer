import { Burger, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslation } from "react-i18next";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { useUser } from "../contexts/UserProvider.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDisclosure, useFullscreen, useNetwork, useViewportSize } from "@mantine/hooks";
import { IconWifi, IconWifiOff, IconWindowMaximize, IconWindowMinimize } from "@tabler/icons-react";

export default function Header() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [opened, { toggle }] = useDisclosure();
  const { height, width } = useViewportSize();
  const networkStatus = useNetwork();
  const { toggle: fullscreenToggle, fullscreen } = useFullscreen();
  const { t } = useTranslation();

  useEffect(() => {
    if (user && user.isAdmin) {
      setIsAdmin(true);
      console.log("Current user is admin");
    } else {
      setIsAdmin(false);
      console.log("Current user is not admin");
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
          {networkStatus.online ? <IconWifi color="green" /> : <IconWifiOff color="red" />}
          <UserMenu />
          <LanguageSwitcher />
          <UnstyledButton onClick={fullscreenToggle}>
            {fullscreen ? (
              <IconWindowMinimize size={32} stroke={0.75} />
            ) : (
              <IconWindowMaximize size={32} stroke={0.75} />
            )}
          </UnstyledButton>
        </Group>
      </Group>
    </Group>
  );
}
