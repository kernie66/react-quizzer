import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Media } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
    <Dropdown inNavbar className="ps-2" toggle={changeLanguage}>
      <DropdownToggle nav>
        <Media src={flagIcon} width="32" height="32" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Change language</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
