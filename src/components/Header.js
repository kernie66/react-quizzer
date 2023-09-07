import { NavLink } from "react-router-dom";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Navbar,
  NavbarBrand,
  Row,
  Spinner,
} from "reactstrap";
import { Container } from "reactstrap";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import OnlineStatus from "./OnlineStatus.js";

const flagIcons = { sv: "/Swedish large.png", en: "/English large.png" };
export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useUser();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage);
  const [flagIcon, setFlagIcon] = useState();

  useEffect(() => {
    const key = language.split("_")[0];
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

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar color="light" light fixed="top" className="Header border-bottom py-1">
      <Container>
        <Row className="d-flex">
          <Col className="me-auto">
            <NavbarBrand className="pt-0">{t("app-name")}</NavbarBrand>
          </Col>
          <Col className="d-none d-sm-block text-end">
            <OnlineStatus />
          </Col>
          <Col xs="3" sm="2" md="1" className="d-inline-flex mx-1 px-0 gx-0">
            {user === undefined ? (
              <Spinner animation="border" />
            ) : (
              <>
                {user !== null && (
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggle}
                    inNavbar
                    className=""
                    style={{ width: 48 }}
                  >
                    <DropdownToggle nav caret>
                      <Media src={user.avatar_url + "&s=32"} className="rounded-circle" />
                    </DropdownToggle>
                    <DropdownMenu style={{ right: 0 }}>
                      <DropdownItem tag={NavLink} to={"/user/" + user.id}>
                        {t("profile")}
                      </DropdownItem>
                      {user.isAdmin && (
                        <DropdownItem tag={NavLink} to={"/admin"}>
                          {t("administer")}
                        </DropdownItem>
                      )}
                      <DropdownItem divider className="bg-light m-0" />
                      <DropdownItem>
                        <a
                          href="https://github.com/kernie66/react-quizzer/issues"
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none"
                        >
                          {t("report-a-problem")}
                        </a>
                      </DropdownItem>
                      <DropdownItem divider className="bg-light m-0" />
                      <DropdownItem tag={NavLink} to={"/password"}>
                        {t("change-password")}
                      </DropdownItem>
                      <DropdownItem onClick={logout}>{t("logout")}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </>
            )}
            <Dropdown inNavbar className="ps-2" style={{ width: 48 }} toggle={changeLanguage}>
              <DropdownToggle nav>
                <Media src={flagIcon} width="32" height="32" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Change language</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
