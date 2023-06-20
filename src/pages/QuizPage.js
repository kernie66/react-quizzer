import { useEffect } from "react";
import Body from "../components/Body";

export default function QuizPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Body sidebar>
      <h3>Quiz info placeholder</h3>
    </Body>
  );
}
