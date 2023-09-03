import { useEffect } from "react";
import Body from "../components/Body";
import Quizzers from "../components/Quizzers.js";

export default function ExplorePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Body sidebar>
      <h1>Explore</h1>
      <Quizzers content="explore" />
    </Body>
  );
}
