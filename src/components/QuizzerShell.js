import { AppShell } from "@mantine/core";
import Header from "./Header.js";

export default function QuizzerShell({ children }) {
  return (
    <AppShell header={{ height: 42 }}>
      <AppShell.Header bg="blue.2">
        <Header />
      </AppShell.Header>
      <AppShell.Main bg="blue.1">{children}</AppShell.Main>
    </AppShell>
  );
}
