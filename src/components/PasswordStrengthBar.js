import { Progress, Group } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";

export default function PasswordStrengthBar({ strength }) {
  const [bars, setBars] = useState(Array(4).fill(0));

  useShallowEffect(() => {
    const newBars = Array(4)
      .fill(0)
      .map((_, index) => (
        <Progress
          styles={{ section: { transitionDuration: "0ms" } }}
          value={strength > 0 && index === 0 ? 100 : strength >= index + 1 ? 100 : 0}
          color={strength > 3 ? "teal" : strength > 2 ? "blue" : strength > 1 ? "yellow" : "red"}
          size={4}
          key={index}
        />
      ));
    setBars(newBars);
  }, [strength]);

  return (
    <Group gap={5} grow mt="xs" mb="md" align="start">
      {bars}
    </Group>
  );
}
