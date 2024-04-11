import { useEffect } from "react";
import Quizzers from "../components/Quizzers";

export default function ExplorePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <h1>Explore</h1>
      <Quizzers content="explore" />
    </>
  );
}
