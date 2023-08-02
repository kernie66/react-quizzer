import { NavLink } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Navbar,
  NavbarBrand,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Container } from "reactstrap";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, logout } = useUser();
  const { t } = useTranslation();

  return (
    <Navbar color="light" light fixed="top" className="Header border-bottom py-1">
      <Container>
        <NavbarBrand className="pt-0">{t("app-name")}</NavbarBrand>
        {user === undefined ? (
          <Spinner animation="border" />
        ) : (
          <>
            {user !== null && (
              <UncontrolledDropdown
                inNavbar
                className="Dropdown float-end text-end"
                style={{ width: 400 }}
              >
                <DropdownToggle nav caret data-bs-display="static">
                  <Media src={user.avatar_url + "&s=32"} className="rounded-circle" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem tag={NavLink} to={"/user/" + user.username}>
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
              </UncontrolledDropdown>
            )}
          </>
        )}
      </Container>
    </Navbar>
  );
}
