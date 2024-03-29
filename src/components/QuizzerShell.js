import { AppShell, Divider } from "@mantine/core";
import Header from "./Header.js";
import { useDisclosure } from "@mantine/hooks";
import { quizzerMenuItems } from "../helpers/quizzerMenuItems.js";
import { useUser } from "../contexts/UserProvider.js";
import { ErrorBoundary } from "react-error-boundary";
import { BasicErrorFallback, logErrorToService } from "../helpers/errorHandlers.js";

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
        <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
          <Header opened={opened} toggle={toggle} />
        </ErrorBoundary>
      </AppShell.Header>
      <AppShell.Navbar py="md" px="md">
        <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
          {!user ? (
            <>
              {menuItems.loginUser}
              <Divider />
              {menuItems.reportIssue}
            </>
          ) : (
            <>
              {menuItems.startPage}
              {menuItems.profile}
              {user.isAdmin && <>{menuItems.administer}</>}
              <Divider />
              {menuItems.reportIssue}
              <Divider />
              {menuItems.changePassword}
              {menuItems.logoutUser}
            </>
          )}
        </ErrorBoundary>
      </AppShell.Navbar>
      <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
        <AppShell.Main bg="blue.1">{children}</AppShell.Main>
      </ErrorBoundary>
    </AppShell>
  );
}
