import { useEffect } from "react";
//import Body from "../components/Body";
import { Button, Checkbox, ColorInput, ColorPicker } from "@mantine/core";
import { IconBrandMantine } from "@tabler/icons-react";
import QuizzerShell from "../components/QuizzerShell.js";
import OnlineStatus from "../components/OnlineStatus.js";
import QuizzerTable from "../components/QuizzerTable.js";

export default function MainPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <QuizzerShell>
      <h3>Quiz info placeholder</h3>
      <Checkbox label="Ready to play some quiz" />
      <Button color="pink">
        <IconBrandMantine />
        Play
      </Button>
      <ColorInput />
      <ColorPicker />
      <OnlineStatus />
      <QuizzerTable />
    </QuizzerShell>
  );
}
