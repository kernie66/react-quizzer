import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Avatar, UnstyledButton } from "@mantine/core";

const flagIcons = { sv: "/Swedish large.png", en: "/English large.png" };

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage);
  const [flagIcon, setFlagIcon] = useState();

  useEffect(() => {
    const key = language.split("-")[0];
    setFlagIcon(flagIcons[key]);
  }, [language]);

  const changeLanguage = () => {
    let newLanguage;
    if (language === "sv") {
      newLanguage = "en";
    } else {
      newLanguage = "sv";
    }
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <UnstyledButton pl={2} onClick={changeLanguage}>
      <Avatar src={flagIcon} size={32} />
    </UnstyledButton>
  );
}
