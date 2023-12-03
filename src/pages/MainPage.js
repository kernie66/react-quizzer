import { useEffect } from "react";
import { Button, Checkbox, ColorInput, ColorPicker } from "@mantine/core";
import { IconBrandMantine } from "@tabler/icons-react";
//import { useEventSource, useEventSourceListener } from "@react-nano/use-event-source";
import QuizzerShell from "../components/QuizzerShell.js";
import OnlineStatus from "../components/OnlineStatus.js";
import QuizzerTable from "../components/QuizzerTable.js";

//const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
//const endpoint = BASE_API_URL + "/api/connect";

export default function MainPage() {
  /*
  const [data, setData] = useState([]);
  const [eventSource, eventSourceStatus] = useEventSource(endpoint, false);

  useEventSourceListener(
    eventSource,
    ["ping"],
    (event) => {
      const eventData = JSON.parse(event.data);
      setData(eventData.message);
    },
    [setData],
  );
*/
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
