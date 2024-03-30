import { AppShell, Divider, ScrollArea } from "@mantine/core";
import Header from "./Header.js";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { quizzerMenuItems } from "../helpers/quizzerMenuItems.js";
import { useUser } from "../contexts/UserProvider.js";
import { ErrorBoundary } from "react-error-boundary";
import { BasicErrorFallback, logErrorToService } from "../helpers/errorHandlers.js";
import { useEffect, useState } from "react";

const headerHeight = 48;

export default function QuizzerShell({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useUser();
  const { height: viewportHeight } = useViewportSize();
  const [mainHeight, setMainHeight] = useState(0);
  const menuItems = quizzerMenuItems(16, toggle);

  useEffect(() => {
    setMainHeight(viewportHeight - headerHeight);
  }, [viewportHeight]);

  return (
    <AppShell
      header={{ height: { headerHeight } }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding={{ base: "xs", sm: "lg", lg: "xl" }}
    >
      <AppShell.Header bg="blue.2" zIndex={250}>
        <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
          <Header opened={opened} toggle={toggle} height={headerHeight} />
        </ErrorBoundary>
      </AppShell.Header>
      <AppShell.Navbar py="md" px="md" mt={headerHeight}>
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
        <ScrollArea h={mainHeight} type="auto" mt={headerHeight}>
          <AppShell.Main bg="blue.1" pt={{ base: "xs", sm: "md", lg: "lg" }}>
            {children}
          </AppShell.Main>
        </ScrollArea>
      </ErrorBoundary>
    </AppShell>
  );
}
