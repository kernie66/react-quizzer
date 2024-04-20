import { useUser } from "../contexts/UserProvider";
import { Avatar, Group, Menu, rem } from "@mantine/core";
import { TbChevronDown } from "react-icons/tb";
import { useState } from "react";
import { useShallowEffect } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { QuizzerMenuItems } from "../helpers/QuizzerMenuItems";

export default function UserMenu() {
  const { user } = useUser();
  const menuItems = QuizzerMenuItems(1);
  const [avatarImage, setAvatarImage] = useState(null);
  const queryClient = useQueryClient();

  useShallowEffect(() => {
    if (user && user.avatarUrl) {
      setAvatarImage(user.avatarUrl + "&s=32");
    } else {
      setAvatarImage(null);
    }
  }, [user]);

  useShallowEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["loggedIn"] });
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
          <TbChevronDown style={{ width: rem(14), height: rem(14) }} />
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
