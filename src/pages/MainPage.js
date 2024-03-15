import { useEffect } from "react";
import { Button, Checkbox, ColorInput, ColorPicker, Text } from "@mantine/core";
import { TbBrandMantine } from "react-icons/tb";
import OnlineStatus from "../components/OnlineStatus.js";
import QuizzerTable from "../components/QuizzerTable.js";
import { useQuizzers } from "../contexts/QuizzerProvider.js";

//const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
//const endpoint = BASE_API_URL + "/api/connect";

export default function MainPage() {
  const { clients } = useQuizzers();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <h3>Quiz info placeholder</h3>
      <Checkbox label="Ready to play some quiz" />
      <Button color="pink">
        <TbBrandMantine />
        Play
      </Button>
      <ColorInput />
      <ColorPicker />
      <OnlineStatus />
      <Text>Number of connected players: {clients()}</Text>
      <Text>Local storage: {localStorage.getItem("userData")}</Text>
      <QuizzerTable />
    </>
  );
}
