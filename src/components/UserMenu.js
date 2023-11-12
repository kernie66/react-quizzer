import { useUser } from "../contexts/UserProvider";
import { Avatar, Group, Loader, Menu, rem } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { quizzerMenuItems } from "../helpers/quizzerMenuItems.js";

export default function UserMenu() {
  const { user } = useUser();
  const menuItems = quizzerMenuItems(1);

  return (
    <>
      {user === undefined ? (
        <Loader color="blue" size="sm" type="bars" mr="1rem" />
      ) : (
        <>
          {user !== null && (
            <Menu trigger="hover" position="bottom-end">
              <Menu.Target>
                <Group gap={0}>
                  <Avatar src={user.avatarUrl + "&s=32"} size={32} />
                  <IconChevronDown style={{ width: rem(14), height: rem(14) }} />
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>{menuItems.startPage}</Menu.Item>
                <Menu.Item>{menuItems.profile}</Menu.Item>
                {user.isAdmin && <Menu.Item>{menuItems.administer}</Menu.Item>}
                <Menu.Divider />
                <Menu.Item>{menuItems.reportIssue}</Menu.Item>
                <Menu.Divider />
                <Menu.Item>{menuItems.changePassword}</Menu.Item>
                <Menu.Item>{menuItems.logoutUser}</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </>
      )}
    </>
  );
}
