import { Navbar, NavbarBrand } from "reactstrap";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import OnlineStatus from "./OnlineStatus.js";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";

export default function Header() {
  const { t } = useTranslation();

  return (
    <Navbar color="light" light fixed="top" className="Header border-bottom py-1">
      <Container>
        <div
          className="d-flex flex-row justify-content-between align-items-center"
          style={{ minHeight: "36px" }}
        >
          <NavbarBrand className="pt-0 fs-4 me-auto">{t("app-name")}</NavbarBrand>
          <div className="px-4 my-0">
            <OnlineStatus />
          </div>
          <UserMenu />
          <LanguageSwitcher />
        </div>
      </Container>
    </Navbar>
  );
}
