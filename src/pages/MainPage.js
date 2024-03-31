import { useEffect, useState } from "react";
import { Button, Checkbox, ColorInput, ColorPicker, Stack, Text } from "@mantine/core";
import { TbBrandMantine } from "react-icons/tb";
import OnlineStatus from "../components/OnlineStatus.js";
import QuizzerTable from "../components/QuizzerTable.js";
import { useQuizzers } from "../contexts/QuizzerProvider.js";
import { useApi } from "../contexts/ApiProvider.js";
import { useUser } from "../contexts/UserProvider.js";

export default function MainPage() {
  const { clients } = useQuizzers();
  const [checked, setChecked] = useState(false);
  const api = useApi();
  const { user } = useUser();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const setQuizMaster = async () => {
      console.log("checked", checked);
      const response = await api.post("/games", { quizMaster: user.id });
      if (response.ok) {
        console.log("QuizMaster set");
      } else {
        console.log(response.error);
      }
    };
    if (checked) setQuizMaster();
  }, [checked]);

  return (
    <Stack pt={0}>
      <h3>Quiz info placeholder</h3>
      <Checkbox
        label="Ready to play some quiz"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <Button color="pink">
        <TbBrandMantine />
        Play
      </Button>
      <ColorInput />
      <ColorPicker />
      <OnlineStatus />
      <Text>Number of connected players: {clients}</Text>
      <Text>Local storage: {localStorage.getItem("userData")}</Text>
      <QuizzerTable />
    </Stack>
  );
}
