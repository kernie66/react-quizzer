import { Title } from "@mantine/core";

// Error logging function
function logErrorToService(error, info) {
  // Use your preferred error logging service
  console.error("Caught an error:", error, info);
}

// Error boundary render function
function BasicErrorFallback({ error }) {
  return (
    <div role="alert">
      <Title order={3} mt={64}>
        Something went wrong:
      </Title>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export { logErrorToService, BasicErrorFallback };
