import { useEffect } from "react";
import Quizzers from "../components/Quizzers.js";
import QuizzerShell from "../components/QuizzerShell.js";

export default function ExplorePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <QuizzerShell>
      <h1>Explore</h1>
      <Quizzers content="explore" />
    </QuizzerShell>
  );
}
