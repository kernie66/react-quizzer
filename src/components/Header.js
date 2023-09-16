import { Navbar, NavbarBrand } from "reactstrap";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import OnlineStatus from "./OnlineStatus.js";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { useUser } from "../contexts/UserProvider.js";
import { useEffect, useState } from "react";
import ShowWindowSize from "./ShowWindowSize.js";

export default function Header() {
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && user.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <Navbar color="light" light fixed="top" className="Header border-bottom py-1">
      <Container fluid="md">
        <div
          className="d-flex flex-row justify-content-between align-items-center"
          style={{ minHeight: "36px" }}
        >
          <NavbarBrand href="/" className="pt-0 fs-4 me-auto">
            {t("app-name")}
          </NavbarBrand>
          {isAdmin && (
            <div className="pe-4 my-0 fs-6">
              <ShowWindowSize />
            </div>
          )}
          <div className="pe-4 my-0">
            <OnlineStatus />
          </div>
          <UserMenu />
          <LanguageSwitcher />
        </div>
      </Container>
    </Navbar>
  );
}
