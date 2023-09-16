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
      <span className="text-end align-middle">
        Size: <strong>{screenSize.width}</strong>&nbsp;x&nbsp;<strong>{screenSize.height}</strong>
      </span>
    </div>
  );
}
