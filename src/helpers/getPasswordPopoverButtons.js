import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function getPasswordPopoverButtons() {
  const { t } = useTranslation();

  const noAction = (event) => {
    event.preventDefault();
  };

  const setPasswordPopoverButton = (color, text) => {
    return (
      <Button id="popoverButton" variant="outline" size="sm" color={color} onClick={noAction}>
        {text}
      </Button>
    );
  };

  const shortScoreWord = setPasswordPopoverButton("gray", t("too-short"));
  const veryWeak = setPasswordPopoverButton("red", t("very-weak"));
  const weak = setPasswordPopoverButton("red", t("weak"));
  const okay = setPasswordPopoverButton("yellow", t("almost"));
  const good = setPasswordPopoverButton("indigo", t("good"));
  const strong = setPasswordPopoverButton("green", t("strong"));

  const scoreWords = [veryWeak, weak, okay, good, strong];

  return [shortScoreWord, scoreWords];
}
