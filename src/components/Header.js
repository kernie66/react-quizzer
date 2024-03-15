import { Burger, Group, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useTranslation } from "react-i18next";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { useUser } from "../contexts/UserProvider.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFullscreen, useNetwork, useShallowEffect, useViewportSize } from "@mantine/hooks";
import { TbMaximize, TbMinimize, TbWifi, TbWifiOff } from "react-icons/tb";
import ConnectedUsers from "./ConnectedUsers.js";

export default function Header({ opened, toggle }) {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const { height, width } = useViewportSize();
  const networkStatus = useNetwork();
  const { toggle: fullscreenToggle, fullscreen } = useFullscreen();
  const { t } = useTranslation();

  useShallowEffect(() => {
    let admin = false;
    if (user) {
      if (user.isAdmin) {
        admin = true;
        console.log("Current user is admin");
      } else {
        console.log("Current user is not admin");
      }
    } else {
      console.log("No current user");
    }
    setIsAdmin(admin);
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
        <Group ml="xl" gap="xs">
          <ConnectedUsers />
        </Group>
        <Group ml="xl" gap="xs" visibleFrom="sm">
          {isAdmin && (
            <Stack gap={0} pr={8}>
              <Text size="xs">X: {width}</Text>
              <Text size="xs">Y: {height}</Text>
            </Stack>
          )}
          {networkStatus.online ? <TbWifi color="green" /> : <TbWifiOff color="red" />}
          <UserMenu navbar />
        </Group>
      </Group>
      <Group mr={0} gap="xs" visibleFrom="sm">
        <LanguageSwitcher />
        <UnstyledButton onClick={fullscreenToggle} ml={8}>
          <ThemeIcon
            variant="gradient"
            size={32}
            radius="xl"
            gradient={{ from: "blue", to: "yellow", deg: 320 }}
          >
            {fullscreen ? <TbMinimize size={24} /> : <TbMaximize size={24} />}
          </ThemeIcon>
        </UnstyledButton>
      </Group>
    </Group>
  );
}
