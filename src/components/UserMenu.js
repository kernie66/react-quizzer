import { useUser } from "../contexts/UserProvider";
import { Avatar, Group, Menu, rem } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { quizzerMenuItems } from "../helpers/quizzerMenuItems.js";
import { useState } from "react";
import { useShallowEffect } from "@mantine/hooks";

export default function UserMenu() {
  const { user } = useUser();
  const menuItems = quizzerMenuItems(1);
  const [avatarImage, setAvatarImage] = useState(null);

  console.log("User:", user);

  useShallowEffect(() => {
    if (user && user.avatarUrl) {
      setAvatarImage(user.avatarUrl + "&s=32");
    } else {
      setAvatarImage(null);
    }
  }, [user]);

  return (
    <Menu trigger="hover" position="bottom-end">
      <Menu.Target>
        <Group gap={0}>
          <Avatar
            src={avatarImage}
            size={32}
            variant="gradient"
            gradient={{ from: "blue", to: "yellow", deg: 320 }}
          />
          <IconChevronDown style={{ width: rem(14), height: rem(14) }} />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {!user ? (
          <>
            <Menu.Item>{menuItems.loginUser}</Menu.Item>
            <Menu.Divider />
            <Menu.Item>{menuItems.reportIssue}</Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>{menuItems.startPage}</Menu.Item>
            <Menu.Item>{menuItems.profile}</Menu.Item>
            {user.isAdmin && <Menu.Item>{menuItems.administer}</Menu.Item>}
            <Menu.Divider />
            <Menu.Item>{menuItems.reportIssue}</Menu.Item>
            <Menu.Divider />
            <Menu.Item>{menuItems.changePassword}</Menu.Item>
            <Menu.Item>{menuItems.logoutUser}</Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
