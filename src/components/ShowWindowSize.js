import { useState, useEffect } from "react";

export default function ShowWindowSize() {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  return (
    <div>
      <ul>
        <li>
          Width: <strong>{screenSize.width}</strong>
        </li>
        <li>
          Height: <strong>{screenSize.height}</strong>
        </li>
      </ul>
    </div>
  );
}
