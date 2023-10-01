import { useEffect } from "react";
import Body from "../components/Body";
import { Button, Checkbox, ColorInput, ColorPicker } from "@mantine/core";
import { IconBrandMantine } from "@tabler/icons-react";

export default function QuizPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Body sidebar>
      <h3>Quiz info placeholder</h3>
      <Checkbox label="Ready to play some quiz" />
      <Button color="pink">
        <IconBrandMantine />
        Play
      </Button>
      <ColorInput />
      <ColorPicker />
    </Body>
  );
}
