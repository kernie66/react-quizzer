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

  const shortScoreWord = setPasswordPopoverButton("secondary", t("too-short"));
  const veryWeak = setPasswordPopoverButton("danger", t("very-weak"));
  const weak = setPasswordPopoverButton("danger", t("weak"));
  const okay = setPasswordPopoverButton("warning", t("almost"));
  const good = setPasswordPopoverButton("info", t("good"));
  const strong = setPasswordPopoverButton("success", t("strong"));

  const scoreWords = [veryWeak, weak, okay, good, strong];

  return [shortScoreWord, scoreWords];
}
