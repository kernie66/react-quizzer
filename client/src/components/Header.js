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
    <Navbar color="light" light fixed="top" className="Header border-bottom">
      <Container>
        <NavbarBrand className="pt-0">{t("app-name")}</NavbarBrand>
        {user === undefined ? (
          <Spinner animation="border" />
        ) : (
          <>
            {user !== null && (
              <UncontrolledDropdown inNavbar className="Dropdown float-end text-end">
                <DropdownToggle nav caret>
                  <Media src={user.avatar_url + "&s=32"} className="rounded-circle" />
                </DropdownToggle>
                <DropdownMenu className="Dropdown">
                  <DropdownItem tag={NavLink} to={"/user/" + user.username}>
                    {t("Profile")}
                  </DropdownItem>
                  <DropdownItem divider className="bg-light" />
                  <DropdownItem tag={NavLink} to={"/password"}>
                    {t("Change password")}
                  </DropdownItem>
                  <DropdownItem onClick={logout}>{t("Logout")}</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </>
        )}
      </Container>
    </Navbar>
  );
}
