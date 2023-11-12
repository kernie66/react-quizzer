import { AppShell, Divider } from "@mantine/core";
import Header from "./Header.js";
import { useDisclosure } from "@mantine/hooks";
import { quizzerMenuItems } from "../helpers/quizzerMenuItems.js";
import { useUser } from "../contexts/UserProvider.js";

export default function QuizzerShell({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useUser();
  const menuItems = quizzerMenuItems(16);

  return (
    <AppShell
      header={{ height: 42 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header bg="blue.2">
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar py="md" px="md">
        {menuItems.startPage}
        {menuItems.profile}
        {user.isAdmin && <>{menuItems.administer}</>}
        <Divider />
        {menuItems.reportIssue}
        <Divider />
        {menuItems.changePassword}
        {menuItems.logoutUser}
      </AppShell.Navbar>
      <AppShell.Main bg="blue.1">{children}</AppShell.Main>
    </AppShell>
  );
}
